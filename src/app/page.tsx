import ChatroomRSocket from "@/components/chatroom/Chatroom";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <h1 className="bg-green-400 h-full">LETS GO GET CHATTING</h1>
      <ChatroomRSocket />
    </div>
  );
}
