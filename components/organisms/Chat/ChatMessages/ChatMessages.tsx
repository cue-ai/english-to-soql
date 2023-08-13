import { Message } from "ai";
import { MessageComponent } from "./MessageComponent";
import {FC} from "react";

type ChatMessageProps = {
  messages: Message[];
};

export const ChatMessages:FC<ChatMessageProps> = ({ messages }) => {
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
