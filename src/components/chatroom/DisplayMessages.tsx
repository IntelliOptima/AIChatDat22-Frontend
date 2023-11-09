import type { ChatMessage } from "../../types/Message";
import { useSession } from 'next-auth/react';
import Image from 'next/image'

export const DisplayMessages = ({ chatMessages }: { chatMessages: ChatMessage[] }) => {

  const { data: session } = useSession();

  return (
    <div>
      {chatMessages.map((message, index) => (
        <div key={index}>
          <div className="flex items-center">
            <Image 
            src={`${session?.user?.image}`}
            width={32}
            height={32}
            alt="user Image"
            className="rounded-full mr-4"
            />
              <p className="my-4 border border-gray-200 w-1/4 rounded-xl p-2 h-auto shadow-md" style={{ wordWrap: "break-word" }}>
              {message.textMessage}
              </p>
          </div>
        </div>
      ))}
    </div>
  );
};
