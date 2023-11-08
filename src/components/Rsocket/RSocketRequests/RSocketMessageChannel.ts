import { RSocket } from "rsocket-core";

import { ChatMessage } from "@/types/Message";
import { createRoute } from "../RSocketConnector";
import { Dispatch, SetStateAction } from "react";


export const rsocketMessageChannel = async (rsocket: RSocket, route: string, chatMessage: ChatMessage, setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>) => {
    console.log(`Executing channelConnection: ${JSON.stringify({ route, chatMessage })}`);
    
    return new Promise((resolve, reject) => {
      rsocket.requestChannel(
        {
          data: Buffer.from(JSON.stringify(chatMessage.message)),
          metadata: createRoute(route),
        },
        1,
        false,
        {
          onError: (e) => reject(e),
          onNext: (payload, isComplete) => {
            console.log(`payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`);
            setChatMessages(cur => [...cur, {
              message: payload.data ? payload.data.toString() : "empty", 
              userId: 1, 
              chatroomId: "1",
            }]);
          },
          onComplete: () => {
            resolve(null);
          },
          onExtension: () => {},
          request: (n) => {
          },
          cancel: () => {},
        }
      );
    });
  }