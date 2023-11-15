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
        `http://localhost:8080/api/v1/chatroom/participatingChatrooms/${user?.id}`,
        setAllChatrooms
      );
    }

    if (localStorage.getItem('currentChatroom')) {
      setCurrentChatroom(JSON.parse(localStorage.getItem('currentChatroom')!));
    }

  }, [allChatrooms, user]);

  useEffect(() => {
    console.log(allChatrooms.length)
    if (allChatrooms.length > 0) {
      if (currentChatroom === undefined) {
        setCurrentChatroom(allChatrooms[0]);     
      }
      FetchData.fetchDataAndSetListOfObjects(
        `http://localhost:8080/api/v1/message/findByChatroomId=${currentChatroom?.id !== undefined ? currentChatroom?.id : allChatrooms[0].id}`,
        setChatMessages
      );
    }
  }, [allChatrooms, currentChatroom]);

  useEffect(() => {

    if (!rsocket && !hasMounted.current) {
      const connectToRSocket = async () => {
        setRSocket(await getRSocketConnection());
        hasMounted.current = true;
      };
      connectToRSocket();
    }    

    if (rsocket && currentChatroom?.id !== undefined) {
      console.log("RSOCKET CUR CHATROOM", currentChatroom);

      rsocketRequestStream(
        rsocket!,
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
