"use client";

import { getRSocketConnection } from "@/components/Rsocket/RSocketConnector";

import { DisplayMessages } from "./DisplayMessages";
import { rsocketRequestStream } from "@/components/Rsocket/RSocketRequests/RSocketRequestStream";
import { rsocketMessageChannel } from "@/components/Rsocket/RSocketRequests/RSocketFireAndForgetMessage";
import { RSocket } from "rsocket-core";
import type { ChatMessage } from "@/types/Message";
import type { Chatroom } from "@/types/Chatroom";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useCurrentChatroom } from "@/contexts/ChatroomContext";
import FetchData from "@/utility/fetchData";

const Chatroom = () => {
  const { user } = useUser();
  const { currentChatroom, allChatrooms, setCurrentChatroom, setAllChatrooms } = useCurrentChatroom();
  const [rsocket, setRSocket] = useState<RSocket | null>(null);
  const [textForChatMessage, setTextForMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (allChatrooms.length === 0) {
      FetchData.fetchDataAndSetListOfObjects(
        `${process.env.NEXT_PUBLIC_FETCH_ALL_CHATROOMS}${user?.id}`,
        setAllChatrooms
      );
    }

    if (localStorage.getItem('currentChatroom')) {
      setCurrentChatroom(JSON.parse(localStorage.getItem('currentChatroom')!));
    }

  }, [allChatrooms, user]);

  useEffect(() => {
    
    if (allChatrooms.length > 0) {
      if (currentChatroom === undefined) {
        setCurrentChatroom(allChatrooms[0]);     
      }
      FetchData.fetchDataAndSetListOfObjects(
        `${process.env.NEXT_PUBLIC_FETCH_MESSAGES}${currentChatroom?.id !== undefined ? currentChatroom?.id : allChatrooms[0].id}`,
        setChatMessages
      );
    }
  }, [allChatrooms, currentChatroom]);

  useEffect(() => {
    const connectToRSocket = async () => {
      try {
        const connection = await getRSocketConnection();
        setRSocket(connection);
        hasMounted.current = true;
      } catch (error) {
        console.error("Failed to establish RSocket connection:", error);
      }
    };

    if (!rsocket && !hasMounted.current) {
      connectToRSocket();
    }

    if (rsocket && currentChatroom?.id !== undefined) {
      rsocketRequestStream(
        rsocket,
        `chat.stream.${currentChatroom.id}`,
        setChatMessages
      );
    }

    // return () => {
    //   if (rsocket) {
    //     rsocket.close();
    //   }
    // };
  }, [rsocket, currentChatroom]);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!rsocket) {
      console.error('RSocket connection is not established.');
      return;
    }
    const chatMessage: ChatMessage = {
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

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex justify-center">          
          <div className="border border-gray-200 w-3/4 h-[500px] rounded-lg shadow-md text-black mt-6 mr-6 mb-4 bg-white p-6 overflow-y-auto">
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
