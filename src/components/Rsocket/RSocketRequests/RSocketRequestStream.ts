import {
  WellKnownMimeType,
  encodeCompositeMetadata,
  encodeRoute,
} from "rsocket-composite-metadata";
import { RSocket } from "rsocket-core";

import MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;
import { ChatMessage } from "@/types/Message";
import { createRoute } from "../RSocketConnector";
import { Dispatch, SetStateAction } from "react";

export const rsocketRequestStream = async (
  rsocket: RSocket,
  route: string,
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>
) => {
  // console.log(`Executing channelConnection: ${JSON.stringify({ route })}`);

  return new Promise((resolve, reject) => {
    const connector = rsocket.requestStream(
      {
        data: Buffer.from("WANT TO CONNECT"),
        metadata: createRoute(route),
      },
      2147483647,
      {
        onError: (e) => reject(e),
        onNext: (payload, isComplete) => {
          console.log(
            `payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`
          );
          const newMessage: ChatMessage = payload.data 
                ? JSON.parse(payload.data.toString()) 
                : undefined;
                
          setChatMessages((curr) => {
            // Check if the new message is already in the array
            if (!curr.some((msg) => JSON.stringify(msg) === JSON.stringify(newMessage))) {
              // If not, add it to the array
              return [...curr, newMessage];
            } else {
              // If it is, return the current array without changes
              return curr;
            }
          });
        },
        onComplete: () => {
          resolve(null);
        },
        onExtension: () => {},
      }
    );
    connector.request(2147483647);
  });
};
