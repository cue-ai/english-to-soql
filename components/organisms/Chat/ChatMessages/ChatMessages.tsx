import { Message } from "ai";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { fontMono, fontSans } from "@/lib/fonts";
import { Button } from "@/components/ui/Button";

type ChatMessageProps = {
  messages: Message[];
};

type MessageProps = {
  message: Message;
};
type CodeBlockProps = { code: string };

const CodeBlock = ({ code }: CodeBlockProps) => {
  console.log(code);
  const runQuery = async () => {
    const vesselId = localStorage.getItem("vesselId");
    const res = await fetch("/api/runQuery", {
      method: "POST",
      body: JSON.stringify({ vesselId, query: code }),
    });
    const data = await res.json();
    console.log(data);
  };
  return (
    <div
      className={`inline-block bg-gray-900 p-2 text-xs font-medium rounded-md text-slate-300 font-mono`}
    >
      {code}

      <div className={"flex mt-4"}>
        <Button
          className={
            "text-xs text-black py-0 bg-green-400 hover:bg-green-500 text-gray-800"
          }
          size={"xs"}
          onClick={runQuery}
        >
          Run
        </Button>
      </div>
    </div>
  );
};

const Message = ({ message }: MessageProps) => {
  const parts = message?.content.split(/(```[\s\S]*?```)/gm);

  return (
    <div
      key={message.id}
      className={`whitespace-pre-wrap  my-4 bg-gray-800 p-4 rounded-lg ${
        message.role === "user"
          ? "text-slate-400 text-sm"
          : "text-white text-sm border border-gray-600"
      }`}
    >
      {/*{message.content}*/}
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // This is a code part
          let code = part.slice(3, -3);
          if (code.startsWith("\n")) {
            code = code.slice(1);
          }

          if (
            code.startsWith("SOQL") ||
            code.startsWith("soql") ||
            code.startsWith("bash")
          ) {
            code = code.slice(4);
          }
          if (code.startsWith("\n")) {
            code = code.slice(1);
          }

          return <CodeBlock code={code} key={index} />;
        } else {
          // This is a non-code part
          return (
            <p key={index} className={"my-0 "}>
              {part}
            </p>
          );
        }
      })}
    </div>
  );
};
export const ChatMessages = ({ messages }: ChatMessageProps) => {
  return (
    <div className={"w-full"}>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};
