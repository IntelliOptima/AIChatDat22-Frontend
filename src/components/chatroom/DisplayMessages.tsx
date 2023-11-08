import type { ChatMessage } from "../../types/Message";

export const DisplayMessages = ({ messages }: { messages: ChatMessage[] }) => {
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
