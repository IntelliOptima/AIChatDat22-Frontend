import { RSocket } from "rsocket-core";

import { ChatMessage } from "@/types/Message";
import { createRoute } from "../RSocketConnector";


export const rsocketMessageChannel = async (rsocket: RSocket, route: string, chatMessage: ChatMessage) => {
    return new Promise((resolve, reject) => {
      rsocket.fireAndForget(
        {
          data: Buffer.from(JSON.stringify(chatMessage)),
          metadata: createRoute(route),
        },
        {
          onError: (e) => reject(e),
          onComplete: () => {
            resolve(null);
          },
        }
      );
    });
  }