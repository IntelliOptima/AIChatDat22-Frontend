import { WellKnownMimeType, encodeCompositeMetadata, encodeRoute } from "rsocket-composite-metadata";
import { RSocket } from "rsocket-core";

import MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;
import { ChatMessage } from "@/types/Message";
import { createRoute } from "../RSocketConnector";

export const rsocketConnectChannel = async (rsocket: RSocket, route: string) => {
    console.log(`Executing channelConnection: ${JSON.stringify({ route })}`);
    
    return new Promise((resolve, reject) => {
      rsocket.requestChannel(
        {
          data: Buffer.from(JSON.stringify({userId: 0, message: "", chatroomId: ""})),
          metadata: createRoute(route),
        },
        0,
        false, 
        {
          onError: (e) => reject(e),
          onNext: (payload, isComplete) => {
            console.log(
              `payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`
            );
  
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