import { ChatMessage } from "./Message";
import { User } from "./User";

export type Chatroom = {
    chatroomId: string;
    chatroomUserCreatorId: number;
    users: User[];
    messages: ChatMessage[];
    createdDate: Date;
    lastModifiedDate: Date;
    version: number;
}