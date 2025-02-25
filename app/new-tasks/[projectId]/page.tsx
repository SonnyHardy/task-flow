'use client'
import { createTask, getProjectInfo, getProjectUsers } from '@/app/actions';
import AssignTask from '@/app/components/AssignTask';
import Wrapper from '@/app/components/Wrapper'
import { Project } from '@/type';
import { useUser } from '@clerk/nextjs';
import { User } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'react-toastify';

const Page = ({params}: {params: Promise<{projectId: string}>}) => {

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'font': []}],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            [{'color': []}, {'background': []}],
            ['code-block'],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const {user} = useUser();
    const email = user?.primaryEmailAddress?.emailAddress as string;
    const [projectId, setProjectId] = useState("");
    const [project, setProject] = useState<Project | null>(null);
    const [usersProject, setUsersProject] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const router = useRouter();
    
    const fetchInfos = async (projectId: string) => {
        try {
            const project = await getProjectInfo(projectId, true);
            setProject(project);

            const associatedUsers = await getProjectUsers(projectId);
            setUsersProject(associatedUsers);
    
        } catch (error) {
            console.error('Error when loading project',error);
        }
    }

    useEffect(() => {
            const getId = async () => {
                const resolvedParams = await params;
                setProjectId(resolvedParams.projectId);
                fetchInfos(projectId);
            };
            getId();
        }, [params, projectId])

        const handleUserSelected = (user: User) => {
            setSelectedUser(user);
        }

        const handleSubmit = async () => {
            if(!name || !projectId || !selectedUser || !description || !dueDate) {
                toast.error('Please fill all the required fields');
                return
            }

            try {
                await createTask(name, description, dueDate, projectId, email, selectedUser.email);
                router.push(`/projects/${projectId}`);
            } catch (error) {
                toast.error("Error when creating the task:" + error);
            }
        }

    return (
        <Wrapper>
            <div>

                <div className="breadcrumbs text-sm">
                    <ul>
                        <li><Link href={`/projects/${projectId}`}>Back</Link></li>
                        <li>
                            <div className='badge badge-primary'>{project?.name}</div>
                        </li>
                    </ul>
                </div>

                <div className='flex flex-col md:flex-row md:justify-between'>
                    <div className='md:w-1/4'>
                        <AssignTask users={usersProject} projectId={projectId} onAssignTask={handleUserSelected} />

                        <div className='flex justify-between items-center mt-4'>
                            <span className='badge badge-info badge-sm'>Due date</span>
                            <input
                                className='input input-bordered border-base-300'
                                onChange={(e) => setDueDate(new Date(e.target.value))}
                                type="date"
                            />
                        </div>
                    </div>

                    <div className='md:w-3/4 mt-4 md:mt-0 md:ml-4'>

                        <div className='flex flex-col justify-between w-full'>
                            <input
                                placeholder='Task name'
                                className='w-full input input-bordered border-base-300 font-bold mb-4'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                            />

                            <ReactQuill
                                placeholder='Describe the task'
                                value={description}
                                onChange={setDescription}
                                modules={modules}
                            />
                        </div>

                        <div className='flex justify-end'>
                            <button className='btn mt-4 btn-md btn-primary' onClick={handleSubmit}>Create task</button>
                        </div>

                    </div>
                </div>

            </div>
        </Wrapper>
    )
}

export default Page
