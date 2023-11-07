export type ChatMessage = {
    userId: number;
    message: string;
    chatroomId: string;
    createdDate?: Date;
    lastModifiedDate?: Date;

};