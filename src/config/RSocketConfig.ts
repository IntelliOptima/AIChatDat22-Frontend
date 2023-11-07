import { RSocketConnector } from "rsocket-core";
import { WebsocketClientTransport } from "rsocket-websocket-client";

export const getRsocketConnection = async (chatroomId: number) => {
    const connector = new RSocketConnector({
        setup: {
            keepAlive: 60000,
            lifetime: 180000,
            dataMimeType: "application/json",
            metadataMimeType: "message/x.rsocket.routing.v0",
        },
        transport: new WebsocketClientTransport({
            url: `ws://localhost:7000/chat/${chatroomId}/subscribe`
        }),
    });

    try {
        const rsocket = await connector.connect();
        console.log(rsocket);
        return rsocket;
    } catch (error) {
        console.error(error);
        // handle error appropriately
    }
};
