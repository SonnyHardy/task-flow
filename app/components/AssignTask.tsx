import { User } from '@prisma/client'
import React, { FC, use, useState } from 'react'
import UserInfo from './UserInfo';

interface AssignTaskProps {
    users: User[];
    projectId: string;
    onAssignTask: (user: User) => void;
}

const AssignTask: FC<AssignTaskProps> = ({users, projectId, onAssignTask}) => {

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleAssign = (user: User) => {
        setSelectedUser(user);
        onAssignTask(user);
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        if(modal) modal.close();
    }

    return (
        <div className='w-full'>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <div className="cursor-pointer border border-base-300 p-5 rounded-xl w-full"
                onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
            >
                <UserInfo
                    role='Assigned to'
                    email={selectedUser?.email || "No body"}
                    name={selectedUser?.name || ""}
                    profileImage={selectedUser?.profileImage || '/profile.avif'}
                />
            </div>

            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-3">Choose a collaborator</h3>
                    <div>
                        {users.map((user) => (
                            <div key={user.id}
                            onClick={() => handleAssign(user)}
                            className='cursor-pointer border border-base-300 p-5 rounded-xl w-full mb-3'>
                                <UserInfo
                                    role='Assign to'
                                    email={user.email || null}
                                    name={user.name || null}
                                    profileImage={user.profileImage || null}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default AssignTask
