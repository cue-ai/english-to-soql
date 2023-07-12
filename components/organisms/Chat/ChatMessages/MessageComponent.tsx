import { Message } from "ai";
import { CodeBlock } from "./CodeBlock";
import React, { useContext, useState } from "react";
import { SoqlResult } from "./SoqlResult";
import { Button } from "@/components/ui/Button";
import { ChatContext } from "./ChatContext";

type MessageProps = {
  message: Message;
};

const cleanCode = (part: string) => {
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
  return code;
};

export const MessageComponent = ({ message }: MessageProps) => {
  const parts = message?.content.split(/(```[\s\S]*?```)/gm);
  const [queryResult, setQueryResult] = useState<any>({});
  const { messages } = useContext(ChatContext);
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedUrl, setSavedUrl] = useState(false);

  const saveQuery = async () => {
    setSaveLoading(true);
    // we need to store query result/ last user message/ current code

    let code = parts?.find(
      (part) => part.startsWith("```") && part.endsWith("```"),
    );
    code = cleanCode(code as string);

    const indexOfCurr = messages.findIndex(
      (messageInst: Message) => message.id === messageInst.id,
    );
    const userMessage: Message = messages
      .slice(0, indexOfCurr)
      .reverse()
      .find(
        (messageInst) =>
          messageInst.role === "user" && !messageInst.id.startsWith("redo"),
      ) as Message;

    const res = await fetch("/api/saveQuery", {
      method: "POST",
      body: JSON.stringify({
        code,
        userContent: userMessage?.content ?? "",
        result: queryResult?.result,
      }),
    });

    const { queryId } = await res.json();
    await navigator.clipboard.writeText(
      process.env.NEXT_PUBLIC_FRONTEND_URL + "/query/" + queryId,
    );

    setSavedUrl(true);
    setSaveLoading(false);
  };
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
          const code = cleanCode(part);

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
        <div className={"my-8 w-full overflow-auto"}>
          <SoqlResult result={queryResult?.result} error={queryResult?.error} />
        </div>
      )}
      {message.role !== "user" &&
        queryResult?.result &&
        !queryResult?.error && (
          <Button
            className={`${
              savedUrl
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-500 hover:bg-gray-600"
            }   text-xs`}
            size={"xs"}
            onClick={saveQuery}
          >
            {savedUrl ? "Saved" : !saveLoading ? "Save query" : "Saving ..."}
          </Button>
        )}
    </div>
  );
};
