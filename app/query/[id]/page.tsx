"use client";
import { useEffect, useState } from "react";
import { Login } from "@/components/organisms/Login/Login";
import { Chat } from "@/components/organisms/Chat/Chat";
import { SoqlResult } from "@/components/organisms/Chat/ChatMessages/SoqlResult";

export type QueryData = {
  code: string;
  userContent: string;
  result: any;
};

export default function QueryResult({ params }: { params: { id: string } }) {
  const { id } = params;
  const [salesforceId, setSalesforceId] = useState(
    localStorage.getItem("salesforceId"),
  );
  const [isFirst, setIsFirst] = useState(false);
  const [queryData, setQueryData] = useState<QueryData | undefined>(undefined);
  const getQueryData = async () => {
    const res = await fetch(`/api/getQueryData?queryId=${id}`, {
      method: "GET",
    });
    const { code, userContent, result } = await res.json();
    if (code && userContent && result) {
      setQueryData({ code, userContent, result });
    }
  };

  useEffect(() => {
    void getQueryData();
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-24  ">
      <div
        className={`z-10 w-full h-full min-h-screen flex-grow items-center lg:flex lg:flex-col ${"pt-24"} `}
      >
        {queryData ? (
          <div
            className={"w-full mt-4 flex flex-col items-center space-y-6 my-12"}
          >
            <p className={"text-sm text-slate-400"}>{queryData.userContent}</p>

            <div
              className={`inline-block bg-gray-900 p-2 text-xs font-medium rounded-md text-slate-300 font-mono max-w-sm`}
            >
              {queryData?.code}
            </div>
            <div className={"w-full flex justify-center overflow-auto"}>
              <SoqlResult error={null} result={queryData?.result} />
            </div>
          </div>
        ) : (
          <h1 className={"text-slate-400 font-bold text-xl mt-8"}>
            No query found
          </h1>
        )}

        {!salesforceId ? (
          <div className={"my-8 w-full"}>
            <Login
              setSalesforceId={setSalesforceId}
              onlyLoginBox={true}
              setIsFirst={setIsFirst}
            />
          </div>
        ) : (
          <Chat
            salesforceId={salesforceId}
            setSalesforceId={setSalesforceId}
            onlyChat={true}
            isFirst={isFirst}
            setIsFirst={setIsFirst}
          />
        )}
      </div>
    </div>
  );
}
