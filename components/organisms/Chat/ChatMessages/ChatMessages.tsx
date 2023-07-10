import { Message } from "ai";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { fontMono, fontSans } from "@/lib/fonts";
import { Button } from "@/components/ui/Button";
import { MessageComponent } from "./MessageComponent";

type ChatMessageProps = {
  messages: Message[];
};

export const ChatMessages = ({ messages }: ChatMessageProps) => {
  return (
    <div className={"w-full"}>
      {messages.map(
        (m, index) =>
          !m.id.startsWith("redo") && (
            <MessageComponent message={m} key={m.id} />
          ),
      )}
    </div>
  );
};
