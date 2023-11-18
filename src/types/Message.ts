export type ChatMessage = {
    id?: number;
    userId: number;
    textMessage: string;
    chatroomId: string;
    createdDate?: Date;
    lastModifiedDate?: Date;

};