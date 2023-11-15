"use client";
import { useState, createContext ,useContext } from "react";

const ChatSidebarContext = createContext({
    sidebarOpen: false,
    setSidebarOpen: (value: boolean) => {}
});


const ChatSidebarProvider = ({ children }: any) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <ChatSidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
            {children}
        </ChatSidebarContext.Provider>
    );
};

export const useChatSidebar = () => useContext(ChatSidebarContext);

export default ChatSidebarProvider;