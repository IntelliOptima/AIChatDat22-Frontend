"use client";
import { useState, useEffect, useCallback } from "react";
import { getRsocketConnection } from "../../config/RSocketConfig";
import { DisplayMessages } from "../DisplayMessages";

export type Message = {
    userId: number;
    message: string;
    chatroomId: number;
    createdDate?: Date;
    lastModifiedDate?: Date;

};

const ChatroomRSocket = () => {
  const [client, setClient] = useState<any | null>(null);
  const [textForMessage, setTextForMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    handleSocketConnection();

  }, []);

  const handleSocketConnection = useCallback(async () => {
    const chatroomId = 1; // Replace with actual chatroom ID
    const rsocketClient = await getRsocketConnection(chatroomId);
    setClient(rsocketClient);
  }, []);

  const sendMessage = () => {
    if (client) {
      const chatroomId = 1; // Replace with actual chatroom ID
      client.fireAndForget({
        data: { message: { userId: 1, message: textForMessage, chatroomId: chatroomId} },
        metadata: String.fromCharCode(`/chat.${chatroomId}`.length) + `/chat.${chatroomId}`,
      });
    }
    setTextForMessage("");
  };

  return (
    <div>

        <div>
          <h2>WELCOME YOU MAY START CHATTING</h2>
          <input
            type="text"
            placeholder="Write a message..."
            value={textForMessage}
            onChange={(e) => setTextForMessage(e.target.value)}
          />
        </div>

      {textForMessage != "" && <button onClick={sendMessage}>Send</button>}

      <DisplayMessages messages={messages} />
    </div>
  );
};

export default ChatroomRSocket;