'use client'
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { SquarePlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { addUserToProject, getProjectsAssociatedWithUser } from '../actions';
import { useUser } from '@clerk/nextjs';
import { Project } from '@/type';
import EmptyState from '../components/EmptyState';
import ProjectComponent from '../components/ProjectComponent';

const Page = () => {
    const {user} = useUser();
    const email = user?.primaryEmailAddress?.emailAddress as string;
    const [inviteCode, setInviteCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState("hidden");
    const [associatedProjects, setAssociatedProjects] = useState<Project[]>([]);

    const fetchProjects = async (email: string) => {
        try {
            const associated = await getProjectsAssociatedWithUser(email);
            setAssociatedProjects(associated);

        } catch (error) {
            console.error(error);
            toast.error('Error when fetching projects');
        }
    };

    useEffect(() => {
        if(email){
            fetchProjects(email);
        }
    }, [email]);

    const handleSubmit = async () => {
        try{
            setIsLoading("");
            if(inviteCode !== "") {
                await addUserToProject(email, inviteCode);
                fetchProjects(email);
                toast.success('You can now collaborate on this project');
                setInviteCode('');
            }else {
                toast.error('Please enter the code');
            }
            fetchProjects(email);
            setIsLoading("hidden");

        }catch(error) {
            setIsLoading("hidden");
            console.error(error);
            toast.error('Invalide code or user is already in this project');
        }
    }

    return (
        <Wrapper>
            <div className='flex'>

                <div className=''>
                    <input type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder='Invitation code'
                        className='w-full p-2 input input-bordered'
                    />
                </div>
                <button className='btn btn-primary ml-4' onClick={handleSubmit}>
                    Join <SquarePlus className='w-4'/>
                </button>
                <span className={`${isLoading} loading loading-spinner text-primary w-10 ml-3`}></span>

            </div>

            <div className='mt-5'>
                {associatedProjects.length > 0 ? (
                    <ul className="w-full grid md:grid-cols-3 gap-6">
                        {associatedProjects.map((project) => (
                            <li key={project.id}>
                                <ProjectComponent project={project} admin={0} style={true}></ProjectComponent>
                            </li>
                        ))}
                    </ul>

                ) : (
                    <div>
                        <EmptyState
                            imageSrc="/empty-project.png"
                            imageAlt="Picture of an empty project"
                            message="No associated project"
                        />
                    </div>
                )}
            </div>
        </Wrapper>
    )
}

export default Page
