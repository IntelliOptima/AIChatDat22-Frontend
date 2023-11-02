"use client";

import { useCallback, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { DisplayMessages } from "@/components/DisplayMessages"

export type Message = {
  senderName: string;
  message: string;
  time: string;
};

const Chatroom = () => {
  const endpointUrl = "ws://localhost:8080/chat";
  const [client, setClient] = useState<Client | null>(null);
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Unsubscribe and disconnect when the component unmounts
    return () => {
      if (client != null) {
        client.deactivate();
        setIsConnected(false);
      }
    };
  }, [client]);

  const handleSocketConnection = useCallback(() => {
    const stompClient = new Client({
      brokerURL: endpointUrl,

      onConnect: () => {
        console.log(`Connected to ${endpointUrl}`);
        setIsConnected(true);

        stompClient.subscribe("/topic/messages", (message) => {
          console.log("THIS IS FROM SUBSCRIBE = ", message);

          if (message.body) {
            const messageBody = JSON.parse(message.body);
            setMessages((currentMessages) => [
              ...currentMessages,
              {
                senderName: messageBody.senderName,
                message: messageBody.message,
                time: messageBody.time,
              },
            ]);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    stompClient.activate();
    setClient(stompClient);
  }, []);

  const sendMessage = () => {
    const messageObject = {
      senderName: senderName,
      message,
      date: new Date(),
    };

    if (client && client.connected) {
      console.log("PUBLISHING JUST NOW");
      client.publish({
        destination: "/app/chat",
        body: JSON.stringify(messageObject),
      });
    }

    setMessage("");
  };

  return (
    <div>
      <div>
        {!isConnected && (
          <input
            type="text"
            placeholder="Enter your chatroom name..."
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
        )}

        {senderName !== "" && !isConnected && (
          <button type="button" onClick={handleSocketConnection}>
            CONNECT
          </button>
        )}
      </div>

      {isConnected && (
        <div>
          <h2>WELCOME {senderName} YOU MAY START CHATTING</h2>
          <input
            type="text"
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      )}

      {message != "" && <button onClick={sendMessage}>Send</button>}

      <DisplayMessages messages={messages} />
    </div>
  );
};

export default Chatroom;
