import ChatSidebarProvider from '@/contexts/ChatSidebarContext';
import { Rubik } from 'next/font/google'
import ChatPanel from '@/components/chatroom/ChatPanel';

const rubik = Rubik({
  weight: '400',
  subsets: ['latin'],
})

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ChatSidebarProvider className={rubik.className}>
      <ChatPanel>
        {children}
      </ChatPanel>
    </ChatSidebarProvider>
  )
}