type WrapperProps = {
    children: React.ReactNode
};

import { FolderGit2 } from 'lucide-react';
import React from 'react'
import Navbar from './Navbar';

const Wrapper = ({children}: WrapperProps) => {
  return (
    <div>

        <Navbar/>

        <div>
            {children}
        </div>

    </div>
  )
}

export default Wrapper
