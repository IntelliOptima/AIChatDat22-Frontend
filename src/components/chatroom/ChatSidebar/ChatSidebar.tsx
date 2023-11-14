"use client";
import React from 'react'
import FetchData from '@/utility/FetchData';
import { useUser } from '@/contexts/UserContext';
import { useCurrentChatroom } from '@/contexts/ChatroomContext'

type ChatSidebarProps = {
  sidebarOpen: boolean;
};

const ChatSidebar = ({ sidebarOpen }: ChatSidebarProps) => {
  const { user } = useUser();
  const {setCurrentChatroom } = useCurrentChatroom();
  return (
    <div
      className={`fixed top-0 bottom-0 left-0 w-[220px] bg-white border-r-2 py-12 
      transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      style={{ zIndex: 0 }}
    >

      <div className="w-full h-full">

        <ul className="flex flex-col pt-10 justify-between h-2/5 text-black leading-loose">
          <a href='#' className='py-2 text-center hover:bg-gray-50 rounded-lg'><li>Chatroom 1</li></a>
          <a href='#' className='py-2 text-center hover:bg-gray-50'><li>Chatroom 2</li></a>
          <a href='#' className='py-2 text-center hover:bg-gray-50'><li>Chatroom 3</li></a>
          <a href='#' className='py-2 text-center hover:bg-gray-50'><li>Chatroom 4</li></a>
          <a href='#' className='py-2 text-center hover:bg-gray-50'><li>Chatroom 5</li></a>
          <a href='#' className='py-2 text-center hover:bg-gray-50'><li>Chatroom 6</li></a>
        </ul>
        
      </div>
      <div className='flex justify-center pb-10'>
          <a href='#' className='text-black text-center w-full hover:scale-110' 
          onClick={
            () => FetchData.postCreateChatroom(`http://localhost:8080/api/v1/chatroom/${user?.id}`, setCurrentChatroom)
          }>
             + Create new chat
             </a>
        </div>

    </div>
  );
};

export default ChatSidebar;
