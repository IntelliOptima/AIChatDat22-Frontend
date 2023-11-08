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
      <ChatLayout>
        <Chat main={main}/>
      </ChatLayout>
    </div>

  );
};

export default Chatroom;
