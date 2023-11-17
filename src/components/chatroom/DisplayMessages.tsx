import type { ChatMessage } from "../../types/Message";
import { useUser } from "../../contexts/UserContext";

import Image from 'next/image'
import { useSession } from "next-auth/react";

const GPTLOGO = '/public/images/GPTImage.jpeg'
const NoImage = '/public/NoImage.jpeg'
import { useCurrentChatroom } from "@/contexts/ChatroomContext";

export const DisplayMessages = ({ chatMessages }: { chatMessages: ChatMessage[] }) => {
  const {currentChatroom} = useCurrentChatroom();
  const user = useUser();


  const findProfileImage = (userId: number) => {
    if (userId === 1) {
      return GPTLOGO;
    } else {
      const userImage = currentChatroom?.users.find((user) => user.id === userId)?.profileImage;
      return userImage ? userImage : NoImage;
    }
  }


  return (
    <div>
      {chatMessages.map((message, index) => (

        <div key={index}>
          <div className={`flex w-full ${message.userId === user.user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex ${message.userId === user.user?.id ? 'flex-row-reverse' : ''} items-center w-1/2 `}>
              {message.userId === 1 ? (
                <Image
                  src={GPTLOGO}
                  width={32}
                  height={32}
                  alt="user Image"
                  className={`${message.userId === user.user?.id ? 'ml-4' : 'mr-4'} mb-16 rounded-full`}
                />
              ) : (
                <Image
                  src={`${findProfileImage(message.userId)}`}
                  //src={`${user.user?.profileImage}`}
                  width={32}
                  height={32}
                  alt="user Image"
                  className={`${message.userId === user.user?.id ? 'ml-4' : 'mr-4'} mb-16 rounded-full`}
                />
              )}
              <p className={` mb-16 border border-gray-200 w-full rounded-xl p-2 h-auto shadow-md`} style={{ wordWrap: "break-word" }}>
                {message.textMessage}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
