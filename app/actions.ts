"use server"

import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function checkAndAddUser(email: string, name: string, profileImage: string) {
    if (!email) return;
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!existingUser && name) {
            await prisma.user.create({
                data: {
                    email,
                    name,
                    profileImage
                }
            })
            console.log("User added to database");
        }else{
            console.log("User already exists");
        }

    }catch(error) {
        console.error("Error during user verification:", error);
    }
}

function generateUniqueCode(): string {
    return randomBytes(6).toString('hex');
}

export async function createProject(name: string, description: string, email: string) {
    try{
        const inviteCode = generateUniqueCode();
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!user){
            throw new Error('User not found');
        }

        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                inviteCode,
                createdById: user.id
            }
        })

        return newProject;

    }catch(error) {
        console.error(error);
        throw new Error;
    }
}

export async function getProjectsCreatedByUser(email: string) {
    try {
        const projects = await prisma.project.findMany({
            where: {
                createdBy: {email}
            },
            include: {
                tasks: {
                    include: {
                        user: true,
                        createdBy: true
                    }
                },
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        return projects.map((project) => ({
            ...project,
            users: project.users.map((userEntry) => userEntry.user)
        }));


    }catch (error){
        console.error(error);
        throw new Error;
    }
}

export async function deleteProjectById(projectId: string) {
    try{
        await prisma.project.delete({
            where: {
                id: projectId
            }
        });
        console.log('Project deleted successfully:', projectId);

    }catch(error) {
        console.error(error);
        throw new Error;
    }
}

export async function addUserToProject(email: string, inviteCode: string) {
    try {
        const project = await prisma.project.findUnique({
            where: {inviteCode: inviteCode}
        });

        if(!project) {
            throw new Error('Project not found');
        }

        const user = await prisma.user.findUnique({
            where: {email: email}
        });

        if(!user) {
            throw new Error('User not found');
        }

        const existingAssociation = await prisma.projectUser.findUnique({
            where: {
                userId_projectId: {
                    userId: user.id,
                    projectId: project.id
                }
            }
        });

        if(existingAssociation) {
            throw new Error('The user is already in this project');
        }

        await prisma.projectUser.create({
            data: {
                userId: user.id,
                projectId: project.id
            }
        });

        return 'User added successfully to this project';

    }catch(error) {
        console.error(error);
        throw new Error;
    }
}

export async function getProjectsAssociatedWithUser(email: string) {
    try{
        const projects = await prisma.project.findMany({
            where: {
                users: {
                    some: {
                        user: {email: email}
                    }
                }
            },
            include: {
                tasks: true,
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        const formattedProjects = projects.map((project) => ({
            ...project,
            users: project.users.map((userEntry) => userEntry.user)
        }))

        return formattedProjects;

    }catch(error) {
        console.error(error);
        throw new Error;
    }
}

export async function getProjectInfo(projectId: string, details: boolean) {
    try {
        const project = await prisma.project.findUnique({
            where: {id: projectId},
            include: details ? {
                tasks: {
                    include:{
                        user: true,
                        createdBy: true
                    }
                },
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                createdBy: true
            } : undefined
        });

        if(project === undefined) {
            throw new Error('Project not found');
        }

        return project;

    } catch (error) {
        console.error(error);
        throw new Error;
    }
}

export async function getProjectUsers(projectId: string) {
    try {
        const projectWithUsers = await prisma.project.findUnique({
            where: {
                id: projectId
            },
            include: {
                users: {
                    include: {user: true}
                }
            }
        });

        return projectWithUsers?.users.map((projectUser => projectUser.user)) || [];
        
    } catch (error) {
        console.error(error);
        throw new Error;
    }
}

export async function createTask(
    name: string,
    description: string,
    dueDate: Date | null,
    projectId: string,
    createdByEmail: string,
    assignToEmail: string | undefined
) {
    try {
        const createdBy = await prisma.user.findUnique({
            where: {email: createdByEmail}
        });
        if(!createdBy) throw new Error(`User with email ${createdByEmail} not found`);

        let assignedUserId = createdBy.id;

        if(assignToEmail){
            const assignedUser = await prisma.user.findUnique({
                where: {email: assignToEmail}
            });
            if(!assignedUser) throw new Error(`User with email ${assignToEmail} not found`);
            assignedUserId = assignedUser.id;
        }

        const newTask = await prisma.task.create({
            data: {
                name,
                description,
                dueDate,
                projectId,
                createdById: createdBy.id,
                userId: assignedUserId
            }
        });

        console.log('Task created successfully:', newTask);
        
    } catch (error) {
        console.error(error);
        throw new Error;
    }
}