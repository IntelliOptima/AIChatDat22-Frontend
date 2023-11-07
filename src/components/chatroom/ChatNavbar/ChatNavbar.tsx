"use client";

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type ChatNavbarProps = {
    openSidebar: () => void;
    };

const ChatNavbar = ({ openSidebar } : ChatNavbarProps) => {
    return (
        <nav className="bg-white p-2 flex flex-row items-center justify-between border-b-2" style={{ zIndex: 1 }}>
        
            <div className="flex items-center ml-10">

                <div className='border p-2 rounded-lg'>
                <Image 
                src="/menu-icon.png"
                height={20}
                width={20}
                alt="menu icon"
                onClick={openSidebar}
                className="cursor-pointer hover:scale-105"
                />
                </div>
            </div>
        </nav >
    )
}

export default ChatNavbar