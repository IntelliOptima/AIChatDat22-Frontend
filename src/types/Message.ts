export type ChatMessage = {
    id?: string;
    userId: number;
    textMessage: string;
    chatroomId: string;
    createdDate?: Date;
    lastModifiedDate?: Date;

};