"use client";

import { getRSocketConnection } from "@/components/Rsocket/RSocketConnector";

import { DisplayMessages } from "./DisplayMessages";
import { rsocketRequestStream } from "@/components/Rsocket/RSocketRequests/RSocketRequestStream";
import { rsocketMessageChannel } from "@/components/Rsocket/RSocketRequests/RSocketFireAndForgetMessage";
import { RSocket } from "rsocket-core";
import type { ChatMessage } from "@/types/Message";
import type { Chatroom } from "@/types/Chatroom";
import { useEffect, useRef, useState } from "react";
import FetchData from "@/utility/fetchData";
import { useUser } from "@/contexts/UserContext";
import { useCurrentChatroom } from "@/contexts/ChatroomContext";
import { fetchData } from "next-auth/client/_utils";

const Chatroom = () => {
  const { user } = useUser();
  const {currentChatroom} = useCurrentChatroom();
  const [rsocket, setRSocket] = useState<RSocket | null>(null);
  const [relatedChatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [textForChatMessage, setTextForMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const hasMounted = useRef(false);

  useEffect(() => {
    FetchData.streamDataAndSetListOfObjects(`http://localhost:8080/api/v1/chatroom/participatingChatrooms/${user?.id}`, setChatrooms);

    if (currentChatroom) {
      FetchData.streamDataAndSetListOfObjects(
        `http://localhost:8080/api/v1/message/`,
        setChatMessages
      );
    }

    if (!rsocket && !hasMounted.current) {
      const connectToRSocket = async () => {
        setRSocket(await getRSocketConnection());
        console.log("ESTABLISHING CONNECTION FOR RSOCKET!");
        hasMounted.current = true;
      };
      connectToRSocket();
    }

    return () => {
      if (rsocket) {
        rsocket.close();
      }
    };
  }, [currentChatroom]);

  useEffect(() => {
    if (rsocket && currentChatroom) {
      rsocketRequestStream(
        rsocket!,
        `chat.stream.${currentChatroom}`,
        setChatMessages
      );      
    }
  }, [rsocket]);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const chatMessage: ChatMessage = {
      userId: user!.id!,
      textMessage: textForChatMessage,
      chatroomId: currentChatroom!.chatroomId,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      // ... any other fields that need to be sent
    };

    console.log("CHatMessages: ", chatMessages);
    await rsocketMessageChannel(
      rsocket!,
      `chat.send.${currentChatroom?.chatroomId}`,
      chatMessage
    );

    setTextForMessage("");
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex justify-center">
          <div className="border border-gray-200 w-3/4 h-[500px] p-2 rounded-lg shadow-md text-black mt-6 mr-6 mb-4 bg-white p-6 overflow-y-auto">
            {chatMessages.length > 0 ? (
              <DisplayMessages chatMessages={chatMessages} />
            ) : (
              <p>No Messages</p>
            )}
          </div>
        </div>

        
          <form onSubmit={sendMessage}>
          <div className="flex justify-center">
          <input
            type="text"
            placeholder="Write a message..."
            value={textForChatMessage}
            onChange={(e) => setTextForMessage(e.target.value)}
            className="border border-gray-400 w-3/4 p-2 rounded-lg shadow-md text-black mr-6 bg-white"
            />
          {textForChatMessage != "" && (
            <button type="submit" className="text-black font-semibold hover:scale-110">
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
