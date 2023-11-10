"use client";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { Chatroom } from '@/types/Chatroom';

type CurrentChatroomContextType = {
  currentChatroom: Chatroom | undefined;
  setCurrentChatroom: Dispatch<SetStateAction<Chatroom | undefined>>;
}

// Define a default value for the context
const defaultChatroomContextValue: CurrentChatroomContextType = {
  currentChatroom: undefined,
  setCurrentChatroom: () => {} // No-op function  
};

const ChatroomContext = createContext<CurrentChatroomContextType>(defaultChatroomContextValue);

export function ChatroomProvider({ children }: { children: ReactNode }) {
  const [currentChatroom, setCurrentChatroom] = useState<Chatroom | undefined>(undefined);

  return (
    <ChatroomContext.Provider value={{ currentChatroom, setCurrentChatroom }}>
      {children}
    </ChatroomContext.Provider>
  );
}

export function useCurrentChatroom() {
  const context = useContext(ChatroomContext);
  if (!context) {
    throw new Error('useCurrentChatroom must be used within a ChatroomProvider');
  }
  return context;
}