"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import { FolderGit2, Menu, X } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { checkAndAddUser } from '../actions';

const Navbar = () => {
    const {user} = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        {href: "/general-projects", label: "Collaborations"},
        {href: "/", label: "My projects"}
    ];

    useEffect(() => {
        const email = user?.primaryEmailAddress?.emailAddress;
        const username = user?.fullName ? user?.fullName : email?.split('@')[0];
        const profileImage = user?.imageUrl as string;

        if(email && username) {
            checkAndAddUser(email, username, profileImage);
        }
    }, [user])

    const isActiveLink = (href: string) => pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

    const renderLinks = (classNames: string) => 
        navLinks.map(({href, label}) => {
            return <Link key={href} href={href} className={`btn-sm ${classNames} ${isActiveLink(href) ? "btn-primary" : ""}`}>
                {label}
            </Link>
        });


  return (
    <div className='border-b border-base-300 px-5 md:px[10%] py-4 relative'>

        <div className='flex justify-between items-center'>
            
            <div className='flex items-center'>
                <div className='bg-primary-content text-primary rounded-full p-2'>
                    <FolderGit2 className='w-6 h-6' />
                </div>
                <span className='ml-3 font-bold text-3xl'>
                    Task <span className='text-primary'>Flow</span>
                </span>
            </div>

            <div className='flex sm:hidden space-x-4'>
                <label className="grid cursor-pointer place-items-center">
                    <input
                        type="checkbox"
                        value="dark"
                        className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1" />
                    <svg
                        className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <path
                        d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                    <svg
                        className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </label>

                <button className='btn btn-ghost w-fit btn-sm' onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu className='w-4' />
                </button>
            </div>

            <div className='hidden sm:flex space-x-4 items-center'>

                <label className="grid cursor-pointer place-items-center">
                    <input
                        type="checkbox"
                        value="dark"
                        className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1" />
                    <svg
                        className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <path
                        d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                    <svg
                        className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </label>

                {renderLinks("btn")}
                <UserButton/>
            </div>

        </div>

        <div className={`absolute top-0 w-full h-screen flex flex-col gap-2 p-4 transition-all duration-300
            sm:hidden bg-base-200 z-50 ${menuOpen ? "left-0" : "-left-full"}`}>

            <div className='flex justify-between'>
                <UserButton/>
                <button className='btn btn-ghost w-fit btn-sm' onClick={() => setMenuOpen(!menuOpen)}>
                    <X className='w-4' />
                </button>
            </div>
            {renderLinks("btn")}
        </div>

    </div>
  )
}

export default Navbar
