/*
 * Copyright 2021-2022 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { RSocketConnector } from "rsocket-core";
import { WebsocketClientTransport } from "rsocket-websocket-client";
import { exit } from "process";
import WebSocket from "ws";

async function main() {
  const connector = new RSocketConnector({
    setup: {
      keepAlive: 100,
      lifetime: 10000,
    },
    transport: new WebsocketClientTransport({
      url: "ws://localhost:6565",
      wsCreator: (url) => new WebSocket(url) as any,
    }),
  });

  const rsocket = await connector.connect();

  await new Promise((resolve, reject) => {
    rsocket.requestResponse(
        { data: Buffer.from("Hello World"), metadata: Buffer.from("request-response")},
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
          
        }
      );
  });
}

main().then(() => exit());