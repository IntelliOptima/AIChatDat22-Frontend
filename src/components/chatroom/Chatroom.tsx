"use client";
import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { makeConnector, requestResponse, createRoute } from "../../config/RSocketConfig";
import Logger from "../../shared/logger";
import { DisplayMessages } from "./DisplayMessages";
import type { Message } from "../../types/Message";
import { channelConnection } from "../../config/RSocketConfig";

async function main(message: Message, setMessages: Dispatch<SetStateAction<Message[]>>) {
  const chatroomId = 1;
  const connector = makeConnector();
  const rsocket = await connector.connect();

  await new Promise((resolve, reject) => {
    let payloadsReceived = 0;
    const maxPayloads = 10;
    
    channelConnection(rsocket, `chat.${chatroomId}`, message);

    // const requester = rsocket.requestResponse(
    //   {
    //     data: Buffer.from(JSON.stringify(message)),
    //     metadata: createRoute(`chat.${chatroomId}`),
    //   },
    //   {
    //     onError: (e) => reject(e),
    //     onNext: (payload, isComplete) => {
    //       Logger.info(
    //         `[client] payload[data: ${payload.data}; metadata: ${payload.metadata}]|isComplete: ${isComplete}`
    //       );

    //       payloadsReceived++;

    //       // request 5 more payloads every 5th payload, until a max total payloads received
    //       if (payloadsReceived % 2 == 0 && payloadsReceived < maxPayloads) {;
    //       } else if (payloadsReceived >= maxPayloads) {
    //         requester.cancel();
    //         setTimeout(() => {
    //           resolve(null);
    //         });
    //       }

    //       if (isComplete) {
    //         resolve(null);
    //       }
    //     },
    //     onComplete: () => {
    //       Logger.info(`requestResponse onComplete`);
    //       resolve(null);
    //     },
    //     onExtension: () => {},
    //   }
    // );

  });
}

const Chatroom = () => {
  const [client, setClient] = useState<any | null>(null);
  const [chatroomId, setChatroomId] = useState<string>("1");
  const [textForMessage, setTextForMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);


  const sendMessage = async () => {
    await main({userId: 1, message: textForMessage, chatroomId: chatroomId}, setMessages);
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

      <div>
        <DisplayMessages messages={messages} />
      </div>

    </div>
  );
};

export default Chatroom;