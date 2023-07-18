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
    <div className="flex min-h-screen flex-col items-center justify-between px-24">
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
      </SalesforceContext.Provider>
  );
}
