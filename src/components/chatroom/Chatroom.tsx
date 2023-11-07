"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { makeConnector, createRoute } from "@/components/Rsocket/RSocketConnector";
import Logger from "@/shared/logger";
import { DisplayMessages } from "./DisplayMessages";
import { ChatMessage } from "@/types/Message";
import { requestChannel } from "@/components/Rsocket/RSocketRequests/RequestsChannel";

async function main(chatMessage: ChatMessage, setMessages: Dispatch<SetStateAction<ChatMessage[]>>) {
  const chatroomId = 1;
  const connector = makeConnector();
  const rsocket = await connector.connect();

  await new Promise((resolve, reject) => {
    let payloadsReceived = 0;
    const maxPayloads = 10;
    
    requestChannel(rsocket, `chat.${chatroomId}`, chatMessage);

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
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);


  const sendMessage = async () => {
    await main({userId: 1, message: textForMessage, chatroomId: chatroomId}, setChatMessage);
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
        <DisplayMessages messages={chatMessage} />
      </div>

    </div>
  );
};

export default Chatroom;
