import { ChatMessage } from "./Message";
import { User } from "./User";

export type Chatroom = {
    id: string;
    chatroomUserCreatorId: number;
    chatroomName: string;
    users: User[];
    messages: ChatMessage[];
    createdDate: Date;
    lastModifiedDate: Date;
    version: number;
}