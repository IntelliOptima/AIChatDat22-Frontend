import { WellKnownMimeType } from "rsocket-composite-metadata";
import { RSocket } from "rsocket-core";
import { ChatMessage } from "@/types/Message";
import { createRoute } from "../RSocketConnector";
import { Dispatch, SetStateAction } from "react";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const rsocketGptRequestStream = async (
    rsocket: RSocket,
    route: string,
    setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>,
    setIsGptStreaming: Dispatch<SetStateAction<boolean>>
) => {
    return new Promise((resolve, reject) => {
        const connector = rsocket.requestStream(
            {
                data: Buffer.from("WANT TO CONNECT"),
                metadata: createRoute(route),
            },
            2147483647,
            {
                onError: reject,
                onNext: async (payload, isComplete) => {
                    console.log(`payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`);

                    
                    if (payload.data?.toString() === "Gpt Finished message") {
                        setIsGptStreaming(false);
                        return;
                    }
                    if (payload.data) {
                        const newMessageContent = payload.data.toString();
                        updateChatMessage(newMessageContent, route, setChatMessages);
                    }
                    
                },
                onComplete: () => {                    
                    resolve(null)},
                onExtension: () => { },
            }
        );
        connector.request(2147483647);
    });
};


let lastPayload = "";

function updateChatMessage(newContent: string, route: string, setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>) {
    const chatroomId = route.split(".")[2];
    const messageUserId = 1; // chatgptID

    setChatMessages(currMessages => {
        const existingMessageIndex = currMessages.findLastIndex(msg => msg.userId === messageUserId && msg.chatroomId === chatroomId);

        if (existingMessageIndex !== -1) {
            // Update existing message
            const updatedMessages = [...currMessages];
            if (newContent !== lastPayload) {
                updatedMessages[existingMessageIndex].textMessage += newContent; // Append new content
                lastPayload = newContent;
            }
            return updatedMessages;
        } else {
            // Add new message if it doesn't exist
            const newMessage: ChatMessage = { chatroomId, textMessage: newContent, userId: messageUserId };
            return [...currMessages, newMessage];
        }
    });
}