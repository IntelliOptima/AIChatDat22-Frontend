"use client";

import {
  getRSocketConnection,

} from "@/components/Rsocket/RSocketConnector";

import { DisplayMessages } from "./DisplayMessages";
import { rsocketRequestStream } from "@/components/Rsocket/RSocketRequests/RSocketRequestStream";
import { rsocketMessageChannel } from "@/components/Rsocket/RSocketRequests/RSocketFireAndForgetMessage";
import { RSocket } from "rsocket-core";
import type { ChatMessage } from "@/types/Message";
import type { Chatroom } from "@/types/Chatroom";
import type { User } from "@/types/User";

import { log } from "console";
import { useEffect, useRef, useState } from "react";
import FetchData from "../../utility/fetchData";

const Chatroom = () => {
  const mockedUser: User = {
    id: 2,
    fullname: "annonymous user",
    profileImage: "https://avatars.githubusercontent.com/u/32313915?v=4",
    email: "test@anonymous.com",
    createdDate: new Date(),
    lastModifiedDate: new Date(),
    version: 1,
  }; // THIS SHOULD BE A CONTEXT IN THE LONG END PLEASE!!!!!!

  const [rsocket, setRSocket] = useState<RSocket | null>(null);
  const [chatroomId, setChatroomId] = useState<string>("1");
  const [textForChatMessage, setTextForMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const hasMounted = useRef(false);

  useEffect(() => {
    console.log("ITS FETCHING MSG");
    //fetchDataStream("http://localhost:8080/api/v1/message", setChatMessages);

    FetchData.streamDataAndSetListOfObjects('http://localhost:8080/api/v1/message', setChatMessages);

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
  }, [chatroomId]);

  useEffect(() => {
    if (rsocket) {
      rsocketRequestStream(
        rsocket!,
        `chat.stream.${chatroomId}`,
        setChatMessages
      );
      console.log(
        "RSOCKET DOING CONNECTION FOR CHANNEL USEEFFECT [RSOCKET != NULL]"
      );
    }
  }, [rsocket]);

  const sendMessage = async () => {
    const chatMessage: ChatMessage = {
      userId: mockedUser.id,
      textMessage: textForChatMessage,
      chatroomId: chatroomId,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      // ... any other fields that need to be sent
    };

    console.log("CHatMessages: ", chatMessages);
    await rsocketMessageChannel(
      rsocket!,
      `chat.send.${chatroomId}`,
      chatMessage
    );

    setTextForMessage("");
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex justify-center">
          <div className="border border-gray-200 w-3/4 h-[500px] rounded-lg shadow-md text-black mt-6 mr-6 mb-4 bg-white p-6">
            {chatMessages.length > 0 ? (
              <DisplayMessages chatMessages={chatMessages} />
            ) : (
              <p>No Messages</p>
            )}
          </div>
        </div>

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
              className="text-black font-semibold hover:scale-110"
              onClick={sendMessage}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
