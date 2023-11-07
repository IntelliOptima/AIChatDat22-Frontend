import { WellKnownMimeType, encodeCompositeMetadata, encodeRoute } from "rsocket-composite-metadata";
import { RSocket } from "rsocket-core";

import MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;
import { ChatMessage } from "@/types/Message";
import { sourceMapsEnabled } from "process";
import { createRoute } from "../RSocketConnector";


export const rsocketMessageChannel = async (rsocket: RSocket, route: string, chatMessage: ChatMessage) => {
    console.log(`Executing channelConnection: ${JSON.stringify({ route, chatMessage })}`);
    
    return new Promise((resolve, reject) => {
      const requester = rsocket.requestChannel(
        {
          data: Buffer.from(JSON.stringify(chatMessage.message)),
          metadata: createRoute(route),
        },
        1,
        false,
        {
          onError: (e) => reject(e),
          onNext: (payload, isComplete) => {
            console.log(
              `payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`
            );
  
            const requesteren = requester.request(1);
            console.log("JEG ER REGUESTER : ", requesteren);

            if (isComplete) {
              resolve(payload);
            }
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