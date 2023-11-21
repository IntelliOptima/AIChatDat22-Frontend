import type { ChatMessage } from "../../types/Message";
import { useUser } from "../../contexts/UserContext";

import Image from 'next/image'
import { useCurrentChatroom } from "@/contexts/ChatroomContext";

const NoImage = '/images/NoImage.jpg';
const GptImage = '/images/GptImage.jpeg';
const DallE3Image = '/images/DallE2.png';

export const DisplayMessages = ({ chatMessages }: { chatMessages: ChatMessage[] }) => {
  const { currentChatroom } = useCurrentChatroom();
  const user = useUser();


  const findProfileImage = (message: ChatMessage) => {
    if (message.userId == 2) {
      return DallE3Image;
    } else if (message.userId == 1) {
      return GptImage;
    }

    const userImage = currentChatroom?.users?.find((user) => user.id === message.userId)?.profileImage;
    return userImage || NoImage;
  }

  const displayLinkMessage = (message: ChatMessage) => {
    if (message.userId === 2) {
      return (
        <Image
          src={message.textMessage}
          alt="Chat Image"
          width={500}
          height={300} 
          className={`mb-16 border border-gray-200 max-w-xl rounded-xl p-2 h-auto shadow-md`}
        />
      );
    } else if (message.textMessage.includes("http")) {
      return (
        <a href={message.textMessage} target="_blank" rel="noopener noreferrer"
          className={`text-blue-500 mb-16 border border-gray-200 w-full rounded-xl p-2 h-auto shadow-md`}
          style={{ wordWrap: "break-word" }}>
          {message.textMessage}
        </a>
      );
    } else {
      return (
        <p className={`mb-16 border border-gray-200 max-w-xl rounded-xl p-2 h-auto shadow-md`} style={{ wordWrap: "break-word" }}>
          {message.textMessage}
        </p>
      );
    }
  }

  return (
    <div>
      {chatMessages.map((message, index) => (

        <div key={index}>
          <div className={`flex w-full ${message.userId === user.user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex ${message.userId === user.user?.id ? 'flex-row-reverse' : ''} items-center w-1/2 `}>
                <Image
                  src={`${findProfileImage(message)}`}                  
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
