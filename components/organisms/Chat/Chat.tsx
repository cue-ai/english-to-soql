import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { WelcomeBox } from "./WelcomeBox";
import { useChat } from "ai/react";
import { ChatMessages } from "@/components/organisms/Chat/ChatMessages/ChatMessages";
import React, {FC, useContext} from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatContext } from "./ChatMessages/ChatContext";
import va from "@vercel/analytics";
import {Loading} from "@/components/atoms/loading/Loading";
import {SalesforceContext} from "@/components/organisms/Contexts/SalesforceContext";

export type ChatProps = {
  isFirst: boolean;
  setIsFirst: (arg: boolean) => void;
  onlyChat?: boolean;
};
export const Chat:FC<ChatProps> = ({
  isFirst,
  setIsFirst,
  onlyChat,
}) => {
  const {salesforceId,refreshToken}=useContext(SalesforceContext)

  const {
    append,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    body: {
      salesforceId,
      refreshToken
    },
    onError: () => {
      alert("There seems to be an error, could you try again/log out and log back in again.")
      // setSalesforceInfo({salesforceId:"",refreshToken:""});
    },
    onFinish: () => {
      va.track("query", { query: input });
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
      className={`flex flex-col items-center  flex-grow w-full h-full pb-24 ${messages.length==0 && "pt-24"} `}
    >
      {messages.length === 0 && !onlyChat ? (
          <WelcomeBox submitQuery={submitQuery} />
      ) : (
        <ChatContext.Provider value={{ append, isLoading, messages }}>
          <ChatMessages messages={messages} />
          {isFirst && messages.length < 2 && (
            <Loading className="mt-8 w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-blue-600 fill-black"/>
          )}
        </ChatContext.Provider>
      )}
      {/*input box*/}
      <div className=" flex flex-col items-center justify-center w-full  my-10 fixed bottom-4 pointer-events-none">
        <form
          className={
            "pointer-events-auto items-center flex mx-auto  md:w-7/12 w-10/12 max-w-2xl  space-x-2 shadow-lg p-4 bg-gray-900 rounded-md"
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
