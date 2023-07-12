"use client";

import { Login } from "@/components/organisms/Login/Login";
import { Chat } from "@/components/organisms/Chat/Chat";
import { useState } from "react";

export default function Home() {
  const [salesforceId, setSalesforceId] = useState("");
  const [isFirst, setIsFirst] = useState(true);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-24  ">
      <div
        className={`z-10 w-full h-full  min-h-screen flex-grow items-center justify-between lg:flex lg:flex-col  ${
          !salesforceId && "pt-24"
        } `}
      >
        {!salesforceId ? (
          <Login setSalesforceId={setSalesforceId} setIsFirst={setIsFirst} />
        ) : (
          <Chat
            salesforceId={salesforceId}
            setSalesforceId={setSalesforceId}
            isFirst={isFirst}
            setIsFirst={setIsFirst}
          />
        )}
      </div>
    </div>
  );
}
