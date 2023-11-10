"use client";

import { Chatroom } from '@/types/Chatroom';
import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';


type CurrentChatroomContextType = {
  currentChatroom: Chatroom | undefined;
  setCurrentChatroom: Dispatch<SetStateAction<Chatroom | undefined>>;
}

const ChatroomContext = createContext<CurrentChatroomContextType | undefined>(undefined);


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
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
