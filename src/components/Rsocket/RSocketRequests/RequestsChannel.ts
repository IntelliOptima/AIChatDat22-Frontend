import { WellKnownMimeType, encodeCompositeMetadata, encodeRoute } from "rsocket-composite-metadata";
import { RSocket } from "rsocket-core";

import MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;
import { ChatMessage } from "@/types/Message";



export const requestChannel = async (rsocket: RSocket, route: string, chatMessage: ChatMessage) => {
    console.log(`Executing channelConnection: ${JSON.stringify({ route, chatMessage })}`);
    
    return new Promise((resolve, reject) => {
      const requester = rsocket.requestChannel(
        {
          data: Buffer.from(JSON.stringify(chatMessage.message)),
          metadata: encodeCompositeMetadata([
            [MESSAGE_RSOCKET_ROUTING, encodeRoute(route)],
          ]),
        },
        1,
        false,
        {
          onError: (e) => reject(e),
          onNext: (payload, isComplete) => {
            console.log(
              `payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`
            );
  
            requester.request(1);
  
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