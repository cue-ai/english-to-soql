import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { WelcomeBox } from "./WelcomeBox";
import { useChat } from "ai/react";
import { ChatMessages } from "@/components/organisms/Chat/ChatMessages/ChatMessages";
import React, { createContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatContext } from "./ChatMessages/ChatContext";

export type ChatProps = {
  salesforceId: string;
  setSalesforceId: (arg: string) => void;
  isFirst: boolean;
  setIsFirst: (arg: boolean) => void;
  onlyChat?: boolean;
};
export const Chat = ({
  salesforceId,
  setSalesforceId,
  isFirst,
  setIsFirst,
  onlyChat,
}: ChatProps) => {
  const {
    append,
    reload,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    body: {
      salesforceId,
    },
    onError: () => {
      localStorage.removeItem("salesforceId");
      setSalesforceId("");
    },
    onFinish: () => {
      setIsFirst(false);
    },
  });

  const submitQuery = async (arg: string) => {
    const newId = uuidv4();
    await append({
      id: newId,
      createdAt: new Date(),
      content: arg,
      role: "user",
    });
  };

  return (
    <div
      className={`flex flex-col items-center  flex-grow w-full h-full pb-24
      ${messages.length === 0 ? "justify-center" : "pt-24"}`}
    >
      {messages.length === 0 && !onlyChat ? (
        <>
          <WelcomeBox submitQuery={submitQuery} />

          <p className={"text-xs text-slate-400 mt-4"}>
            Note: Your first ever request may take a couple of seconds
          </p>
        </>
      ) : (
        <ChatContext.Provider value={{ append, isLoading, messages }}>
          <ChatMessages messages={messages} />
          {isFirst && messages.length < 2 && (
            <svg
              aria-hidden="true"
              className=" mt-8 w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-blue-600 fill-black"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
        </ChatContext.Provider>
      )}
      {/*input box*/}
      <div className=" flex flex-col items-center justify-center w-full  my-10 fixed bottom-4">
        <form
          className={
            "items-center flex mx-auto w-7/12 max-w-2xl  space-x-2 shadow-lg p-4 bg-gray-900 rounded-md"
          }
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="Send a question"
            type={"text"}
            disabled={isLoading}
            onChange={handleInputChange}
            className={
              "focus:outline-none  bg-gray-800 border-gray-800 text-white f"
            }
            value={input}
          />
          <Button
            type="submit"
            className={"bg-blue-700 hover:bg-blue-800 "}
            size={"sm"}
          >
            Ask
          </Button>
        </form>
        {/*<p className={"mt-4 text-sm  text-slate-500"}>See previous questions</p>*/}
      </div>
    </div>
  );
};
