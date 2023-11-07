"use client";
import { useState, useEffect, useCallback } from "react";
import { makeConnector, requestResponse, createRoute } from "../../config/RSocketConfig2";
import Logger from "../../shared/Logger";
import { DisplayMessages } from "../DisplayMessages";

export type Message = {
    userId: number;
    message: string;
    chatroomId: number;
    createdDate?: Date;
    lastModifiedDate?: Date;

};

async function main() {
  const connector = makeConnector();
  const rsocket = await connector.connect();

  await requestResponse(rsocket, "request-response", "Hello World!");

  await requestResponse(
    rsocket,
    "request-response",
    "Another request-response message!"
    // JSON.stringify({ user: "user1", content: "a message" })
  );

  await new Promise((resolve, reject) => {
    let payloadsReceived = 0;
    const maxPayloads = 10;
    const requester = rsocket.requestResponse(
      {
        data: Buffer.from("Hello World"),
        metadata: createRoute("request-response"),
      },
      {
        onError: (e) => reject(e),
        onNext: (payload, isComplete) => {
          Logger.info(
            `[client] payload[data: ${payload.data}; metadata: ${payload.metadata}]|isComplete: ${isComplete}`
          );

          payloadsReceived++;

          // request 5 more payloads every 5th payload, until a max total payloads received
          if (payloadsReceived % 2 == 0 && payloadsReceived < maxPayloads) {;
          } else if (payloadsReceived >= maxPayloads) {
            requester.cancel();
            setTimeout(() => {
              resolve(null);
            });
          }

          if (isComplete) {
            resolve(null);
          }
        },
        onComplete: () => {
          Logger.info(`requestResponse onComplete`);
          resolve(null);
        },
        onExtension: () => {},
      }
    );
  });
}

const Chatroom = () => {
  const [client, setClient] = useState<any | null>(null);
  const [textForMessage, setTextForMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);


  const sendMessage = async () => {
    await main();
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

export default Chatroom;