"use client";

import { getRSocketConnection } from "@/components/Rsocket/RSocketConnector";

import { DisplayMessages } from "./DisplayMessages";

import { rsocketMessageChannel } from "@/components/Rsocket/RSocketRequests/RSocketFireAndForgetMessage";
import { RSocket } from "rsocket-core";
import type { ChatMessage } from "@/types/Message";
import type { Chatroom } from "@/types/Chatroom";
import { useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useCurrentChatroom } from "@/contexts/ChatroomContext";
import { handleAddUserToChatroom, useSetupChatroom } from "./ChatroomUtils";

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
  const [textForChatMessage, setTextForMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const hasMounted = useRef(false);

  useSetupChatroom({ allChatrooms, user, currentChatroom, setCurrentChatroom, setAllChatrooms, rsocket, setRSocket, setChatMessages, hasMounted });

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
    <div className="flex justify-center content-center">
      <div className="flex flex-col flex-1">
        <div className="flex justify-center">
          <div className="border border-gray-200 w-3/4 h-[700px] rounded-lg shadow-md text-black mt-6 mr-6 mb-4 bg-white p-6 overflow-y-auto">
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
