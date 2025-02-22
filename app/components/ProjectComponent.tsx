import { Project } from '@/type'
import { Copy, FolderGit2 } from 'lucide-react'
import React, { FC } from 'react'

interface ProjectProps {
    project: Project
    admin: number
}

const ProjectComponent: FC<ProjectProps> = ({project, admin}) => {

    const totalTasks = project.tasks?.length;
    const tasksByStatus = project.tasks?.reduce(
        (acc, task) => {
            if(task.status === "To Do") acc.toDo++;
            else if(task.status === "In Progress") acc.inProgress++;
            else if(task.status === "Done") acc.done++;
            return acc;
        },
        {
            toDo: 0, inProgress: 0, done: 0
        }
    ) ?? {toDo: 0, inProgress: 0, done: 0};

    const donePercentage = totalTasks ? Math.round((tasksByStatus.done / totalTasks) * 100) : 0;
    const inProgressPercentage = totalTasks ? Math.round((tasksByStatus.inProgress / totalTasks) * 100) : 0;
    const toDoPercentage = totalTasks ? Math.round((tasksByStatus.toDo / totalTasks) * 100) : 0;


  return (
    <div key={project.id} className={`border border-base-300 p-5 shadow-sm text-base-content rounded-xl w-full text-left`}>

        <div className='w-full flex items-center mb-3'>
            <div className='bg-primary-content text-xl h-10 w-10 rounded-lg flex justify-center items-center'>
                <FolderGit2 className='w-6 text-primary' />
            </div>
            <div className='badge ml-3 font-bold'>
                {project.name}
            </div>
        </div>

        <div className={`mb-3`}>
            <span>Collaborators</span>
            <div className='badge badge-sm badge-ghost ml-1'>{project.users?.length}</div>
        </div>

        {admin === 1 && (
            <div className='flex justify-between items-center rounded-lg p-2 border border-base-300 mb-3 bg-base-200/30'>
                <p className='text-primary font-bold ml-3'>{project.inviteCode}</p>
                <button className='btn btn-sm ml-2'>
                    <Copy className='w-4' />
                </button>
            </div>
        )}

    </div>
  )
}

export default ProjectComponent
