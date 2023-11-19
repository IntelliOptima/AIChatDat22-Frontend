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
                data: Buffer.from("Connecting to stream"),
                metadata: createRoute(route),
            },
            2147483647,
            {
                onError: reject,
                onNext: async (payload, isComplete) => {

                    const newMessage: ChatMessage = payload.data 
                    ? JSON.parse(payload.data.toString()) 
                    : undefined;
                    
                    if (newMessage.textMessage === "Gpt Finished message") {
                        setIsGptStreaming(false);
                        return;
                    }

                    if (newMessage.userId === 1 && newMessage.textMessage !== "GPT Response Start") {
                        console.log(`payload[Gpt message: ${newMessage.textMessage}; isComplete |${isComplete}`);
                        updateChatMessage(newMessage, setChatMessages);

                    } else {
                        setChatMessages((curr) => {
                            console.log(`payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`);
                            // Check if the new message is already in the array
                            if (!curr.some((msg) => JSON.stringify(msg) === JSON.stringify(newMessage))) {
                              // If not, add it to the array
                              return [...curr, newMessage];
                            } else {
                              // If it is, return the current array without changes
                              return curr;
                            }
                          });
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




function updateChatMessage(newContent: ChatMessage, setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>) {
    setChatMessages(currMessages => {
        const existingMessageIndex = currMessages.findLastIndex(msg => 
            msg.userId === newContent.userId && 
            msg.chatroomId === newContent.chatroomId);

        if (existingMessageIndex !== -1) {
            // Update existing message
            const updatedMessages = [...currMessages];
            updatedMessages[existingMessageIndex].textMessage = newContent.textMessage; // Replace with the new content
            return updatedMessages;
        } else {
            // Add new message if it doesn't exist
            return [...currMessages, newContent];
        }
    });
}


