import { Message } from "@/components/chatroom/Chatroom";

export const DisplayMessages = ({ messages }: { messages: Message[] }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
        <p style={{ wordWrap: "break-word" }}>
          {message.userId}: {message.message}
        </p>
        </div>
      ))}
    </div>
  );
};
