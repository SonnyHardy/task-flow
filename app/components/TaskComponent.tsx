import { Task } from '@/type'
import React, { FC } from 'react'
import UserInfo from './UserInfo';
import Link from 'next/link';
import { ArrowRight, Trash } from 'lucide-react';

interface TaskProps {
    task: Task;
    index: number;
    email?: string;
    onDelete?: (taskId: string) => void;
}

const TaskComponent: FC<TaskProps> = ({task, index, email, onDelete}) => {

    const canDelete: boolean = email === task.createdBy?.email;
    const handleDeleteClick = () => {
        if(onDelete) {
            onDelete(task.id);
        }
    }

    return (
        <>
            <td>{index +1}</td>

            <td>
                <div className='flex flex-col'>
                    <div className={`badge text-xs mb-2 font-semibold
                        ${task.status === 'To Do' ? 'bg-red-200' : ''}
                        ${task.status === 'In Progress' ? 'bg-yellow-200' : ''}
                        ${task.status === 'Done' ? 'bg-green-200' : ''}
                    `}>
                        {task.status === 'To Do' && 'To do'}
                        {task.status === 'In Progress' && 'In progress'}
                        {task.status === 'Done' && 'Done'}
                    </div>
                    <span className='text-sm font-bold'>
                        {task.name.length > 100 ? `${task.name.slice(0, 100)}...` : task.name}
                    </span>
                </div>
            </td>

            <td>
                <UserInfo
                    role=''
                    email={task.user?.email || null}
                    name={task.user?.name || null}
                    profileImage={task.user?.profileImage || '/profile.avif'}
                />
            </td>

            <td>
                <div className='text-xs text-gray-500 hidden md:flex'>
                    {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                </div>
            </td>

            <td>
                <div className='flex h-fit'>
                    <Link className='btn btn-sm btn-primary' href={`/task-details/${task.id}`}>
                        More <ArrowRight className='w-4'/>
                    </Link>

                    {canDelete && (
                        <button className='btn btn-sm ml-2' onClick={handleDeleteClick}>
                            <Trash className='w-4'/>
                        </button>
                    )}
                </div>
            </td>

        </>
    )
}

export default TaskComponent
