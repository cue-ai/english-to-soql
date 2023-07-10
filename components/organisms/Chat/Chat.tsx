import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { WelcomeBox } from "./WelcomeBox";
import { useChat } from "ai/react";
import { ChatMessages } from "@/components/organisms/Chat/ChatMessages/ChatMessages";
import React, { createContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatContext } from "./ChatMessages/ChatContext";

export type ChatProps = {
  vesselId: string;
};
export const Chat = ({ vesselId }: ChatProps) => {
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
      vesselId,
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
      className={`flex flex-col items-center   w-full h-full min-h-screen pb-24
      ${messages.length === 0 ? "justify-center" : "pt-24"}`}
    >
      {messages.length === 0 ? (
        <WelcomeBox submitQuery={submitQuery} />
      ) : (
        <ChatContext.Provider value={{ append, isLoading }}>
          <ChatMessages messages={messages} />
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
