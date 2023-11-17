"use client";
import React, { useState } from 'react'
import FetchData from '@/utility/fetchData';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useCurrentChatroom } from '@/contexts/ChatroomContext'
import { ChatroomCreatorAlert } from '@/components/SwalActions/CreateChatroomAlert';

type ChatSidebarProps = {
  sidebarOpen: boolean;
};

const ChatSidebar = ({ sidebarOpen }: ChatSidebarProps) => {
  const { user } = useUser();
  const { allChatrooms } = useCurrentChatroom();
  const { setCurrentChatroom } = useCurrentChatroom();
  const [newChatroomName, setNewChatroomName] = useState<string>('');


  const handleCreateChatroom = async () => {
    const newChatroomName = await ChatroomCreatorAlert();
    setNewChatroomName(newChatroomName);
    if (newChatroomName) {
      console.log('newChatroomName', newChatroomName)
    }
  }

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 w-[220px] bg-white border-r-2 py-12 
      transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      style={{ zIndex: 0 }}
    >

      <div className="w-full h-full">

        <ul className="flex flex-col pt-10 justify-between h-2/5 text-black leading-loose">

          {allChatrooms.map((chatroom, id) => (
            <a key={id} href='#' className='py-2 text-center hover:bg-gray-50 rounded-lg'
              onClick={ () => setCurrentChatroom(chatroom)}>
              <li>{chatroom.chatroomName}</li>
            </a>
          ))
          }
        </ul>

      </div>
      <div className='flex justify-center pb-10'>
        <a href='#' className='text-black text-center w-full hover:scale-110'
          onClick={() => handleCreateChatroom()
          .then(() => FetchData.postCreateChatroom(`${process.env.NEXT_PUBLIC_CREATE_NEW_CHATROOM}${user?.id}`, setCurrentChatroom, newChatroomName))}>
          + Create new chat
        </a>
      </div>

    </div>
  );
};

export default ChatSidebar;
