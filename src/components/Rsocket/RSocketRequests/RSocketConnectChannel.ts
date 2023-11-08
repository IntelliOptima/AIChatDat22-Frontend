import { WellKnownMimeType, encodeCompositeMetadata, encodeRoute } from "rsocket-composite-metadata";
import { RSocket } from "rsocket-core";

import MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;
import { ChatMessage } from "@/types/Message";
import { createRoute } from "../RSocketConnector";
import { Dispatch, SetStateAction } from "react";

export const rsocketConnectChannel = async (rsocket: RSocket, route: string, setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>) => {
    console.log(`Executing channelConnection: ${JSON.stringify({ route })}`);
    
    return new Promise((resolve, reject) => {
      const connector = rsocket.requestChannel(
        {
          data: Buffer.from(""),
          metadata: createRoute(route),
        },
        0,
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
      connector.request(2147483647)
    });
  }