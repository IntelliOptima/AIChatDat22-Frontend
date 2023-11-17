"use client";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { Chatroom } from '@/types/Chatroom';

type CurrentChatroomContextType = {
  currentChatroom: Chatroom | undefined;
  allChatrooms: Chatroom[];
  setCurrentChatroom: Dispatch<SetStateAction<Chatroom | undefined>>;
  setAllChatrooms: Dispatch<SetStateAction<Chatroom[]>>;
}

// Define a default value for the context
const defaultChatroomContextValue: CurrentChatroomContextType = {
  currentChatroom: undefined,
  allChatrooms: [],
  setCurrentChatroom: () => {}, // No-op function  
  setAllChatrooms: () => {} // No-op function
};

const ChatroomContext = createContext<CurrentChatroomContextType>(defaultChatroomContextValue);

export function ChatroomProvider({ children }: { children: ReactNode }) {
  const [currentChatroom, setCurrentChatroom] = useState<Chatroom | undefined>(undefined);
  const [allChatrooms, setAllChatrooms] = useState<Chatroom[]>([]);

  return (
    <ChatroomContext.Provider value={{ currentChatroom, allChatrooms, setAllChatrooms ,setCurrentChatroom }}>
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