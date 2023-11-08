import { RSocket } from "rsocket-core";

import { ChatMessage } from "@/types/Message";
import { createRoute } from "../RSocketConnector";


export const rsocketMessageChannel = async (rsocket: RSocket, route: string, chatMessage: ChatMessage) => {
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