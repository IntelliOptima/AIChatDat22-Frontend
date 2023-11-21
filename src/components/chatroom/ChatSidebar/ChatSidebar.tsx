"use client";
import React, { useState } from 'react'
import FetchData from '@/utility/fetchData';
import { useUser } from '@/contexts/UserContext';
import { useCurrentChatroom } from '@/contexts/ChatroomContext'
import ChatroomNameInput from '../ChatroomNameInput';
import { useRouter } from 'next/navigation';
import { ChatroomCreatorAlert } from '@/components/SwalActions/CreateChatroomAlert';
import Image from 'next/image';
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import PopoverSidebarContent from './PopoverSidebarContent';
import { ChatroomDeleteAlert } from '@/components/SwalActions/ChatroomDeleteAlert';
import { LeaveChatroomAlert } from '@/components/SwalActions/LeaveChatroomAlert';

type ChatSidebarProps = {
  sidebarOpen: boolean;
};

const ChatSidebar = ({ sidebarOpen }: ChatSidebarProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { currentChatroom, allChatrooms } = useCurrentChatroom();
  const { setAllChatrooms, setCurrentChatroom } = useCurrentChatroom();
  const [newChatroomName, setNewChatroomName] = useState<string>('');
  const [showChatroomNameInput, setShowChatroomNameInput] = useState<boolean>(false);


  const handleCreateChatroom = async () => {
    const chatroomName = await ChatroomCreatorAlert();
    if (chatroomName) {
      FetchData.postCreateChatroom(`${process.env.NEXT_PUBLIC_CREATE_NEW_CHATROOM}${user?.id}`, setAllChatrooms, chatroomName)
    }
  }

  const handleLeaveClick = async (userId: number, chatroomId: string) => {
      LeaveChatroomAlert().then(() => {
          FetchData.leaveChatroom(`${process.env.NEXT_PUBLIC_LEAVE_CHATROOM}${chatroomId}/${userId}`, currentChatroom?.id ?? "", setAllChatrooms)
      }
    )
  }

  const handleDeleteClick = async (id: string, chatroomName: string) => {
    const deleteVerification = await ChatroomDeleteAlert(chatroomName);
    if(deleteVerification){
      FetchData.deleteChatroom(`${process.env.NEXT_PUBLIC_DELETE_CHATROOM}${id}`, currentChatroom?.id ?? "", setAllChatrooms)
    }
  }

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 w-[220px] bg-white border-r-2 pt-12 
      transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      style={{ zIndex: 0 }}
    >

      <div className="w-full h-full">

        <ul className="flex flex-col pt-10 h-2/5 text-black leading-loose">

          <a className='text-black text-center w-full hover:scale-110 hover:cursor-pointer transition duration-200'
            onClick={() => handleCreateChatroom()}>
            + Create new chat
          </a>

          {allChatrooms.map((chatroom, id) => (
            <div key={id}
              className={`relative ${chatroom.id === currentChatroom?.id ? 'bg-[#EFEFEF]' : ''}
              my-2 py-2 text-center ${chatroom.id === currentChatroom?.id ? 'hover:bg-gray-100' : 'hover:bg-gray-100'} 
              hover:cursor-pointer rounded-lg`}
              onClick={() => setCurrentChatroom(chatroom)}>
              <li>{chatroom.chatroomName}</li>
              {
                chatroom.id === currentChatroom?.id &&

                <Popover placement="right-start" offset={15} showArrow>
                  <PopoverTrigger>
                    <Image
                      src="/images/dots.png"
                      width={20}
                      height={10}
                      alt='dots'
                      className='absolute right-2 top-1 hover:cursor-pointer hover:scale-110 transition duration-200'
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="bg-white border border-gray-300 rounded-lg w-full px-4 py-2">
                      <div className="flex flex-col">
                        <PopoverSidebarContent textColor="black" imagePath="/images/document.png" contentTitle="Get a resumé" />
                        <PopoverSidebarContent textColor="black" imagePath="/images/settings.png" contentTitle="Settings" />
                        <PopoverSidebarContent onClick={() => handleLeaveClick(user?.id ?? 0, currentChatroom.id)} textColor="black" imagePath="/images/leave.png" contentTitle="Leave Chatroom" />
                        <PopoverSidebarContent onClick ={() => handleDeleteClick(currentChatroom.id, currentChatroom.chatroomName)} textColor="red-600" imagePath="/images/delete.png" contentTitle="Delete Chatroom" />
                      </div>
                   
                    </div>
                  </PopoverContent>
                </Popover>

              }

            </div>
          ))
          }
        </ul>

      </div>

      <div className='flex flex-col items-center justify-center pb-20'>
        {
          showChatroomNameInput &&
          <ChatroomNameInput
            setNewChatroomName={setNewChatroomName}
            handleCreateChatroom={handleCreateChatroom}
          />
        }

      </div>

    </div>
  );
};

export default ChatSidebar;
