import { Message } from "ai";
import { CodeBlock } from "./CodeBlock";
import React, { useContext, useEffect, useState } from "react";
import { SoqlResult } from "./SoqlResult";

import { ChatContext } from "./ChatContext";
import { AiOutlineCopy } from "react-icons/ai";
import { BiDownload } from "react-icons/bi";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import va from "@vercel/analytics";

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
  const [downloadedUrl, setDownloadedUrl] = useState(false);

  // USE EFFECTS TO MANAGE LOAD/DOWNLOAD STATE
  useEffect(() => {
    if (!savedUrl) return;
    const timer = setTimeout(() => {
      setSavedUrl(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [savedUrl]);

  useEffect(() => {
    if (!downloadedUrl) return;
    const timer = setTimeout(() => {
      setDownloadedUrl(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [downloadedUrl]);

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
    va.track("queryShard", { queryId });

    await navigator.clipboard.writeText(
      process.env.NEXT_PUBLIC_FRONTEND_URL + "/query/" + queryId,
    );

    setSavedUrl(true);
    setSaveLoading(false);
  };

  const downloadQuery = () => {
    const csv = Papa.unparse(queryResult.result.records);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "query.csv");
    setDownloadedUrl(true);
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

      {queryResult && (
        <div className={"my-8 w-full overflow-auto"}>
          <SoqlResult result={queryResult?.result} error={queryResult?.error} />
        </div>
      )}
      {message.role !== "user" &&
        queryResult?.result &&
        !queryResult?.error && (
          <div className={"flex"}>
            <button
              className={`mr-4 pointer-events-auto flex items-center text-xs bg-slate-800 border-slate-700 border py-1 px-2 rounded-md text-white my-2 hover:bg-slate-900`}
              onClick={saveQuery}
            >
              <AiOutlineCopy className={"h-5 mr-1"} />
              {savedUrl
                ? "Saved to Clipboard"
                : !saveLoading
                ? "Save query"
                : "Saving ..."}
            </button>
            <button
              className={`pointer-events-auto flex items-center text-xs bg-slate-800 border-slate-700 border py-1 px-2 rounded-md text-white my-2 hover:bg-slate-900`}
              onClick={downloadQuery}
            >
              <BiDownload className={"h-5 mr-1"} />
              {downloadedUrl ? "Downloaded" : "Download query result"}
            </button>
          </div>
        )}
    </div>
  );
};
