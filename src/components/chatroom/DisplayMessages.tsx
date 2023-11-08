import type { ChatMessage } from "../../types/Message";

export const DisplayMessages = ({ chatMessages }: { chatMessages: ChatMessage[] }) => {
  return (
    <div>
      {chatMessages.map((message, index) => (
        <div key={index}>
        <p className="my-4" style={{ wordWrap: "break-word" }}>
            {message.textMessage}
        </p>
        </div>
      ))}
    </div>
  );
};
