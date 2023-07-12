import { Message } from "ai";
import { MessageComponent } from "./MessageComponent";

type ChatMessageProps = {
  messages: Message[];
};

export const ChatMessages = ({ messages }: ChatMessageProps) => {
  return (
    <div className={"w-full"}>
      {messages.map(
        (m) =>
          !m.id.startsWith("redo") && (
            <MessageComponent message={m} key={m.id} />
          ),
      )}
    </div>
  );
};
