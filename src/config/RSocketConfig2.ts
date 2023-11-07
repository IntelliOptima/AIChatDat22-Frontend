import { RSocket, RSocketConnector } from "rsocket-core";
import { WebsocketClientTransport } from "rsocket-websocket-client";
import {
  encodeCompositeMetadata,
  encodeRoute,
  WellKnownMimeType,
} from "rsocket-composite-metadata";
import Logger from "../shared/logger";
import { exit } from "process";
import MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING;
import MESSAGE_RSOCKET_COMPOSITE_METADATA = WellKnownMimeType.MESSAGE_RSOCKET_COMPOSITE_METADATA;

/**
 * This example assumes you have a RSocket server running on 127.0.0.1:9000 that will respond
 * to requests at the following routes:
 *  - login (requestResponse)
 *  - message (requestResponse)
 *  - messages.incoming (requestStream)
 */

export function makeConnector() {
  const connectorConnectionOptions = {
    url: "ws://localhost:6565",
  };
  console.log(
    `Creating connector to ${JSON.stringify(connectorConnectionOptions)}`
  );
  return new RSocketConnector({
    setup: {
      metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
      lifetime: 60000,
      keepAlive: 10000,
    },
    transport: new WebsocketClientTransport(connectorConnectionOptions),
  });
}

export function createRoute(route?: string) {
  let compositeMetaData = undefined;
  if (route) {
    const encodedRoute = encodeRoute(route);

    const map = new Map<WellKnownMimeType, Buffer>();
    map.set(MESSAGE_RSOCKET_ROUTING, encodedRoute);
    compositeMetaData = encodeCompositeMetadata(map);
  }
  return compositeMetaData;
}

export async function requestResponse(rsocket: RSocket, route: string, data: string) {
  console.log(`Executing requestResponse: ${JSON.stringify({ route, data })}`);
  return new Promise((resolve, reject) => {
    return rsocket.requestResponse(
      {
        data: Buffer.from(data),
        metadata: encodeCompositeMetadata([
          [MESSAGE_RSOCKET_ROUTING, encodeRoute(route)],
        ]),
      },
      {
        onError: (e) => {
          reject(e);
        },
        onNext: (payload, isComplete) => {
          Logger.info(
            `requestResponse onNext payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`
          );
          resolve(payload);
        },
        onComplete: () => {
          Logger.info(`requestResponse onComplete`);
          resolve(null);
        },
        onExtension: () => {},
      }
    );
  });
}
