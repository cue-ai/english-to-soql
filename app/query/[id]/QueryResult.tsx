"use client"
import { useEffect, useState } from "react";
import { Login } from "@/components/organisms/Login/Login";
import { Chat } from "@/components/organisms/Chat/Chat";
import { SoqlResult } from "@/components/organisms/Chat/ChatMessages/SoqlResult";
import va from "@vercel/analytics";
import { SalesforceQueryResult } from "@/shared/types/salesforceTypes";
import {useGetSalesforceInfo} from "@/shared/hooks/useGetSalesforceInfo";
import {SalesforceContext} from "@/components/organisms/Contexts/SalesforceContext";
import {Header} from "@/components/organisms/header";


export type QueryData = {
  code: string;
  userContent: string;
  result: SalesforceQueryResult;
};

export default function QueryResult({ id }: { id: string }) {
  const {salesforceInfo, setSalesforceInfo} = useGetSalesforceInfo()
  const {refreshToken,salesforceId}=salesforceInfo;

  const [isFirst, setIsFirst] = useState(false);
  const [queryData, setQueryData] = useState<QueryData | undefined>(undefined);
  const getQueryData = async () => {
    console.log(id)
    const res = await fetch(`/api/query/${id}`, {
      method: "GET",
    });
    const { code, userContent, result } = await res.json();
    if (code && userContent && result) {
      setQueryData({ code, userContent, result });
    }
  };

  useEffect(() => {
    va.track("sharedPageViewed", { queryId: id });
    void getQueryData();
  }, [id]);

  return (
      <SalesforceContext.Provider value={{ salesforceId, setSalesforceInfo,refreshToken }}>
        <Header/>
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
              onlyLoginBox={true}
              setIsFirst={setIsFirst}
            />
          </div>
        ) : (
          <Chat
            onlyChat={true}
            isFirst={isFirst}
            setIsFirst={setIsFirst}
          />
        )}
      </div>
    </div>
      </SalesforceContext.Provider>
  );
}
