import { Message } from "ai";
import { CodeBlock } from "./CodeBlock";
import { useState } from "react";
import { SoqlResult } from "./SoqlResult";

type MessageProps = {
  message: Message;
};
export const MessageComponent = ({ message }: MessageProps) => {
  const parts = message?.content.split(/(```[\s\S]*?```)/gm);
  const [queryResult, setQueryResult] = useState<any>({});
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
            code.startsWith("sql") ||
            code.startsWith("bash")
          ) {
            code = code.slice(4);
          }
          if (code.startsWith("\n")) {
            code = code.slice(1);
          }

          return (
            <CodeBlock
              code={code}
              key={index}
              setQueryResult={setQueryResult}
              queryResult={queryResult}
            />
          );
        } else {
          // This is a non-code part
          return (
            <>
              <p key={index} className={"my-0 "}>
                {part}
              </p>
            </>
          );
        }
      })}
      {/*{message?.role === "user" && <button>Refresh question</button>}*/}

      {queryResult && (
        <div className={"mt-8"}>
          <SoqlResult result={queryResult?.result} error={queryResult?.error} />
        </div>
      )}
    </div>
  );
};