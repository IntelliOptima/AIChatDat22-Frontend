"use client";

import { getRSocketConnection } from "@/components/Rsocket/RSocketConnector";

import { DisplayMessages } from "./DisplayMessages";

import { rsocketMessageChannel } from "@/components/Rsocket/RSocketRequests/RSocketFireAndForgetMessage";
import { RSocket } from "rsocket-core";
import {v4 as uuidv4} from 'uuid';
import type { ChatMessage } from "@/types/Message";
import type { Chatroom } from "@/types/Chatroom";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useCurrentChatroom } from "@/contexts/ChatroomContext";
import { handleAddUserToChatroom, useSetupChatroom } from "./ChatroomUtils";
import { isGPTStreamingAlert } from "../SwalActions/IsGPTStreamingAlert";
import { rsocketGptRequestStream } from "../Rsocket/RSocketRequests/RSocketGPTRequestStream";
import { randomUUID } from "crypto";

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
      <div className="flex flex-col flex-1">
        <div className="flex justify-center">
          <div 
          ref={chatWindowRef}
          className="border border-gray-200 w-3/4 h-[700px] rounded-lg shadow-md text-black mt-6 mr-6 mb-4 bg-white p-6 overflow-y-auto">
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

      <div className="flex-0 text-black">
        <button type="button" onClick={() => handleAddUserToChatroom(currentChatroom)} >+ ADD FRIEND</button>
      </div>

    </div>
  );
};

export default Chatroom;