import { WellKnownMimeType, encodeCompositeMetadata, encodeRoute } from "rsocket-composite-metadata";
import { RSocket } from "rsocket-core";

import MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;


export async function requestResponse(rsocket: RSocket, route: string, chatMessage: string) {
    console.log(`Executing requestResponse: ${JSON.stringify({ route, chatMessage })}`);
    return new Promise((resolve, reject) => {
      return rsocket.requestResponse(
        {
          data: Buffer.from(chatMessage),
          metadata: encodeCompositeMetadata([
            [MESSAGE_RSOCKET_ROUTING, encodeRoute(route)],
          ]),
        },
        {
          onError: (e) => {
            reject(e);
          },
          onNext: (payload, isComplete) => {
            console.log(
              `requestResponse onNext payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`
            );
            resolve(payload);
          },
          onComplete: () => {
            console.log(`requestResponse onComplete`);
            resolve(null);
          },
          onExtension: () => {},
        }
      );
    });
  }