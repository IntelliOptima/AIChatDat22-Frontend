"use client";


import { DisplayMessages } from "./DisplayMessages";
import { rsocketMessageChannel } from "@/components/Rsocket/RSocketRequests/RSocketFireAndForgetMessage";
import { RSocket } from "rsocket-core";
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from "@/types/Message";
import type { Chatroom } from "@/types/Chatroom";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useCurrentChatroom } from "@/contexts/ChatroomContext";
import { handleAddUserToChatroom, useSetupChatroom } from "./ChatroomUtils";
import Image from "next/image";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";



enum ChatRoomState {
  Default,
  Loading,
  Error,
  OK,
}

const Chatroom = () => {
  const { user } = useUser();
  const [state, setState] = useState(ChatRoomState.Default); // TODO use state for loading spinner and other informational display
  const { currentChatroom, allChatrooms, setCurrentChatroom, setAllChatrooms } = useCurrentChatroom();
  const [rsocket, setRSocket] = useState<RSocket | null>(null);
  const [textForChatMessage, setTextForMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGptStreaming, setIsGptStreaming] = useState(false);
  const hasMounted = useRef(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useSetupChatroom({ allChatrooms, user, currentChatroom, setCurrentChatroom, setAllChatrooms, rsocket, setRSocket, setChatMessages, hasMounted, setIsGptStreaming });

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!rsocket) {
      console.error('RSocket connection is not established.');
      return;
    }

    // if (isGptStreaming && textForChatMessage.toLowerCase().startsWith("@gpt")) {
    //   console.log(isGptStreaming)
    //   isGPTStreamingAlert();
    //   return;
    // }

    // if (!isGptStreaming && textForChatMessage.toLowerCase().startsWith("@gpt")) {

    //   setIsGptStreaming(true);
    // }

    const chatMessage: ChatMessage = {
      id: uuidv4(),
      userId: user!.id!,
      textMessage: textForChatMessage,
      chatroomId: currentChatroom?.id!,
      createdDate: new Date(),
      lastModifiedDate: new Date()
    };


    await rsocketMessageChannel(
      rsocket!,
      `chat.send.${currentChatroom?.id}`,
      chatMessage
    );

    setTextForMessage("");
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  }


  return (
    <div className="flex justify-center content-center">
      <div className="flex flex-col justify-center flex-1">

      <div className="flex w-5/6 justify-end">
        <Popover placement="left-start" offset={10} showArrow>
          <PopoverTrigger>
            <Image
              src="/images/group-chat.png"
              width={45}
              height={45}
              alt="Group Chat Icon"
              className="hover:scale-110 hover:cursor-pointer transition duration-200"
            />
          </PopoverTrigger>
          <PopoverContent className="lg:w-[400px] md:w-[300px]">
            <div className="bg-white border border-gray-300 rounded-lg w-full px-4 py-2">
              <div className="">

                <div className="flex items-center hover:cursor-pointer hover:scale-105 transition duration-200 my-2">
                <Image
                src="/images/add-user.png"
                width={25}
                height={25}
                alt="Add User Icon"
                className="mx-2"
                />
                <button className="text-[20px] my-2 hover:scale-105 transition duration-200" type="button" onClick={() => handleAddUserToChatroom(currentChatroom)} >Add to chatroom</button>
                </div>

                <div className="border border-gray-200 w-full my-2">{/* Gray Line in popover */}</div>

                </div>
              <div>
                {currentChatroom?.users.map((user, id) => (
                  user.id !== 1 && (
                    <div key={id} className="flex items-center hover:cursor-pointer hover:scale-105 transition duration-200 my-4">
                     
                    <Image
                      src={`${user.profileImage}`}
                      width={30}
                      height={30}
                      alt="User Image"
                      className="mx-2 rounded-full"
                      />
                    <p className="text-[18px]">{user.fullName}</p>
                    </div>
                   )))}
                </div>
            </div>
          </PopoverContent>
        </Popover>
        



        </div>



        <div className="flex flex-col items-center justify-center">

          <div
            ref={chatWindowRef}
            className="border border-gray-200 w-3/4 h-[600px] rounded-lg shadow-md text-black mr-6 p-6 mb-4 bg-white overflow-y-auto">
            {chatMessages.length > 0 ? (
              <DisplayMessages chatMessages={chatMessages} />
            ) : (
              <p>No Messages</p>
            )}
          </div>
        </div>

        <form onSubmit={sendMessage}>
          <div className="flex justify-center">
            <textarea
              placeholder="Write a message..."
              value={textForChatMessage}
              onKeyDown={handleKeyPress}
              onChange={(e) => setTextForMessage(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
              style={{ resize: 'none' }}
              className="border border-gray-400 w-3/4 p-2 rounded-lg shadow-md text-black mr-6 bg-white"
            />
            {textForChatMessage != "" && (
              <button
                type="submit"
                className="text-black font-semibold hover:scale-110"
              >
                Send
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatroom;