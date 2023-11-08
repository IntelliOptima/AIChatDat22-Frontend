"use client";

import React, { useEffect, useState } from 'react';
import ChatNavbar from './ChatNavbar/ChatNavbar';
import ChatSidebar from './ChatSidebar/ChatSidebar';
import { useChatSidebar } from '@/contexts/ChatSidebarContext';


type ChatProps = {
  children?: React.ReactNode;
};

const ChatPanel = ({ children }: ChatProps) => {
  const { sidebarOpen, setSidebarOpen } = useChatSidebar();

  useEffect(() => {
    const storedSidebarOpen = localStorage.getItem('sidebarOpen');
    if (storedSidebarOpen) {
      setSidebarOpen(JSON.parse(storedSidebarOpen));
    }
  }, []);

  const openSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    localStorage.setItem('sidebarOpen', JSON.stringify(!sidebarOpen));
  }

  return (
    <div className="flex flex-col">
      <ChatNavbar openSidebar={openSidebar} />
      <div className="flex">
        <ChatSidebar sidebarOpen={sidebarOpen} />
        <main
          className={`flex-grow p-4 transition-all duration-300 ease-in-out transform ${
            sidebarOpen ? 'ml-[250px]' : 'ml-0'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChatPanel;
