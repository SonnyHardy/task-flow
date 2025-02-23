'use client'
import { getProjectInfo } from '@/app/actions';
import ProjectComponent from '@/app/components/ProjectComponent';
import UserInfo from '@/app/components/UserInfo';
import Wrapper from '@/app/components/Wrapper'
import { Project } from '@/type';
import { useUser } from '@clerk/nextjs';
import { CopyPlus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const Page = ({params}: {params: Promise<{projectId: string}>}) => {
    const {user} = useUser();
    //const email = user?.primaryEmailAddress?.emailAddress as string;

    const [projectId, setProjectId] = useState("");
    const [project, setProject] = useState<Project | null>(null);

    const fetchInfos = async (projectId: string) => {
        try {
            const project = await getProjectInfo(projectId, true);
            setProject(project);

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

    return (
        <div>
            <Wrapper>
                <div className='md:flex md:flex-row flex-col'>

                    <div className='md:w-1/3 xl:w-1/4'>
                        <div className='p-5 border border-base-300 rounded-xl mb-6'>
                            <UserInfo
                                role='Created by'
                                email={project?.createdBy?.email || null}
                                name={project?.createdBy?.name || null}
                                profileImage={user?.imageUrl || null}
                            />
                        </div>

                        <div className='w-full'>
                            {project && (
                                <ProjectComponent project={project} admin={0} style={false}></ProjectComponent>
                            )
                            }
                        </div>

                    </div>

                    <div className='mt-6 md:ml-6 md:mt-0 md:w-3/4'>
                    <div className='md:flex md:justify-between'>
                        <Link href={`/new-tasks/${projectId}`} className='btn btn-sm mt-2 md:mt-0'>
                            New task <CopyPlus className='w-4'/>
                        </Link>
                    </div>
                    </div>

                </div>
            </Wrapper>
        </div>
    )
}

export default Page
