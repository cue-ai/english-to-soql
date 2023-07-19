"use client";

import { Login } from "@/components/organisms/Login/Login";
import { Chat } from "@/components/organisms/Chat/Chat";
import { useState } from "react";
import {SalesforceContext} from "@/components/organisms/Contexts/SalesforceContext";
import {useGetSalesforceInfo} from "@/shared/hooks/useGetSalesforceInfo";
import { Header } from "@/components/organisms/header";

export default function Home() {
  const {salesforceInfo, setSalesforceInfo} = useGetSalesforceInfo();
  const {salesforceId,refreshToken}=salesforceInfo;
  const [isFirst, setIsFirst] = useState(true);

  return (
      <SalesforceContext.Provider value={{ salesforceId, setSalesforceInfo, refreshToken  }}>
        <Header/>
    <div className="flex min-h-screen flex-col items-center justify-between px-2 md:px-24">
      <div
        className={`z-10 w-full h-full  min-h-screen flex-grow items-center justify-between lg:flex lg:flex-col  ${
          !salesforceId && "pt-24"
        } `}
      >
        {!salesforceId ? (
          <Login  setIsFirst={setIsFirst} />
        ) : (
          <Chat
            isFirst={isFirst}
            setIsFirst={setIsFirst}
          />
        )}
      </div>
    </div>
        <div className={"w-screen text-center py-2"}>
          <a className={"text-xs pl-2 text-gray-500 hover:text-gray-700 hidden md:inline-block"}
              href={"https://www.notion.so/cue-ai/AskSalesforce-Terms-and-Services-66e0503f953a42df90735f6aee082e97?pvs=4"}>Terms and services</a>
        </div>
      </SalesforceContext.Provider>
  );
}
