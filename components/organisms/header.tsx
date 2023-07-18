"use client";
import * as process from "process";
import {useContext} from "react";
import {SalesforceContext} from "@/components/organisms/Contexts/SalesforceContext";

export const Header = () => {
    const {setSalesforceInfo,salesforceId}=useContext(SalesforceContext)
    return(
  <header className=" z-50 flex items-center justify-between w-full  px-24 shrink-0 ">
    <div className="pb-4 flex items-center justify-between space-x-2 w-full h-full border-b border-gray-500 border-opacity-50 font-bold text-white mt-10">
      <div
        className={"inline-block flex cursor-pointer"}
        onClick={() => {
          window.location.href = process.env.NEXT_PUBLIC_FRONTEND_URL as string;
        }}
      >
        <img src="/salesforceLogo.svg" alt="Logo" className={"mr-2"} />
        <h1>AskSalesforce</h1>
      </div>
        {salesforceId &&<button
            className="text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-1 px-4 rounded"
            onClick={() => setSalesforceInfo({refreshToken: "", salesforceId: ""})}
        >
            Logout
        </button>}
    </div>
  </header>
);}
