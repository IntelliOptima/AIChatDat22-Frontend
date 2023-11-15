export type ChatMessage = {
    userId: number;
    textMessage: string;
    chatroomId: string;
    createdDate?: Date;
    lastModifiedDate?: Date;

};