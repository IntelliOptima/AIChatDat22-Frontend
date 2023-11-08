"use client";
import { useState, Dispatch, SetStateAction, useEffect, useRef } from "react";
import {
  getRSocketConnection,
  createRoute,
} from "@/components/Rsocket/RSocketConnector";
import Logger from "@/shared/logger";
import { DisplayMessages } from "./DisplayMessages";
import { rsocketConnectChannel } from "@/components/Rsocket/RSocketRequests/RSocketConnectChannel";
import { rsocketMessageChannel } from "@/components/Rsocket/RSocketRequests/RSocketMessageChannel";
import { RSocket } from "rsocket-core";
import type { ChatMessage } from "@/types/Message";
import type { Chatroom } from "@/types/Chatroom";

async function main(
  chatMessage: ChatMessage,
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
) {
  const chatroomId = 1;
  const rsocket = await getRSocketConnection();

  await new Promise((resolve, reject) => {
    let payloadsReceived = 0;
    const maxPayloads = 10;
  });
}

const Chatroom = () => {
  const userId = 1; // THIS SHOULD BE A CONTEXT IN THE LONG END PLEASE!!!!!!

  const [rsocket, setRSocket] = useState<RSocket | null>(null);
  const [chatroomId, setChatroomId] = useState<string>("1");
  const [currentChat, setCurrentChat] = useState<Chatroom | null>(null);
  const [textForChatMessage, setTextForMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const hasMounted = useRef(false);

  useEffect(() => {
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
      rsocketConnectChannel(rsocket!, `chat.${chatroomId}`, setChatMessages);
      setIsConnected(true);
      console.log(
        "RSOCKET DOING CONNECTION FOR CHANNEL USEEFFECT [RSOCKET != NULL]"
      );
    }
  }, [rsocket]);

  const sendMessage = async () => {
    rsocketMessageChannel(rsocket!, `chat.${chatroomId}`, {
      chatroomId: chatroomId,
      message: textForChatMessage,
      userId: userId,
    });
    
    console.log(chatMessages);

    setTextForMessage("");
  };

  return (
    <div>
      <div>
        <h2>WELCOME YOU MAY START CHATTING</h2>
        <input
          type="text"
          placeholder="Write a message..."
          value={textForChatMessage}
          onChange={(e) => setTextForMessage(e.target.value)}
        />
      </div>

      {textForChatMessage != "" && <button onClick={sendMessage}>Send</button>}

      <div>
        <DisplayMessages messages={chatMessages} />
      </div>
    </div>
  );
};

export default Chatroom;
