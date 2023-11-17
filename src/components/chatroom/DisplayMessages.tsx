import type { ChatMessage } from "../../types/Message";
import { useUser } from "../../contexts/UserContext";

import Image from 'next/image'
import { useCurrentChatroom } from "@/contexts/ChatroomContext";

const NoImage = '/images/NoImage.jpg';

export const DisplayMessages = ({ chatMessages }: { chatMessages: ChatMessage[] }) => {
  const { currentChatroom } = useCurrentChatroom();
  const user = useUser();


  const findProfileImage = (userId: number) => {
    const userImage = currentChatroom?.users.find((user) => user.id === userId)?.profileImage;
    return userImage ? userImage : NoImage;    
  }

  const displayLinkMessage = (message: ChatMessage) => {
    const link = message.textMessage.split(' ').find((word) => word.includes('http'));
    return link ? (
      <a href={link} target="_blank" rel="noopener noreferrer"
        className={`text-blue-500 mb-16 border border-gray-200 w-full rounded-xl p-2 h-auto shadow-md`}
        style={{ wordWrap: "break-word" }}>
        {link}
      </a>
    ) : (
      <p className={`mb-16 border border-gray-200 w-auto rounded-xl p-2 h-auto shadow-md`} style={{ wordWrap: "break-word" }}>
        {message.textMessage}
      </p>
    );
  }

  return (
    <div>
      {chatMessages.map((message, index) => (

        <div key={index}>
          <div className={`flex w-full ${message.userId === user.user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex ${message.userId === user.user?.id ? 'flex-row-reverse' : ''} items-center w-1/2 `}>
                <Image
                  src={`${findProfileImage(message.userId)}`}                  
                  width={32}
                  height={32}
                  alt="user Image"
                  className={`${message.userId === user.user?.id ? 'ml-4' : 'mr-4'} mb-16 rounded-full`}
                />
              {displayLinkMessage(message)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
