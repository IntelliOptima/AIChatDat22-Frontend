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
import { fetchData } from "next-auth/client/_utils";
import FetchData, { fetchChatMessages } from "@/utility/FetchData";

enum ChatRoomState {
  Default,
  Loading,
  Error,
  OK,
}

const Chatroom = () => {
  const { user } = useUser();
  const { currentChatroom, setCurrentChatroom } = useCurrentChatroom();

  const [state, setState] = useState(ChatRoomState.Default);

  const [rsocket, setRSocket] = useState<RSocket | null>(null);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>();
  const [textForChatMessage, setTextForMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>();

  useEffect(() => {
    let socket: RSocket;
    let cancelSocket = false;

    (async () => {
      socket = await getRSocketConnection();
      if (cancelSocket) {
        socket.close();
        return;
      }

      setRSocket(socket);
    })();

    return () => {
      cancelSocket = true;
      if (socket) socket.close();
    };
  }, []);

  useEffect(() => {
    FetchData.fetchDataAndSetListOfObjects(
      `http://localhost:8080/api/v1/chatroom/participatingChatrooms/${user?.id}`,
      setChatrooms
    );
  }, []);

  useEffect(() => {
    const current = chatrooms ? chatrooms[0] : undefined;
    setCurrentChatroom(current);
  }, [chatrooms]);

  useEffect(() => {
    if (!currentChatroom) {
      setChatMessages(undefined);
      return;
    }

    let cancelFetch = false;

    (async () => {
      const messages = await fetchChatMessages(currentChatroom.id);
      if (cancelFetch) return;

      if (messages == undefined) {
        // todo handle network error - what messages to show
      }
      setChatMessages(messages);
    })();

    return () => {
      cancelFetch = true;
    };
  }, [currentChatroom]);

  useEffect(() => {
    if (rsocket && currentChatroom?.id !== undefined) {
      console.log("RSOCKET CUR CHATROOM", currentChatroom);

      rsocketRequestStream(
        rsocket!,
        `chat.stream.${currentChatroom.id}`,
        setChatMessages
      );
    }
  }, [rsocket, currentChatroom]);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const chatMessage: ChatMessage = {
      userId: user!.id!,
      textMessage: textForChatMessage,
      chatroomId: currentChatroom?.id!,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
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
          <div className="border border-gray-200 w-3/4 h-[500px] p-2 rounded-lg shadow-md text-black mt-6 mr-6 mb-4 bg-white p-6 overflow-y-auto">
            {chatMessages ? (
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
