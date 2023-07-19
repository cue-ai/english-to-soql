"use client";
import {useContext} from "react";
import {SalesforceContext} from "@/components/organisms/Contexts/SalesforceContext";


export const Header = () => {
    const {setSalesforceInfo,salesforceId}=useContext(SalesforceContext)
    return(
  <header className="sticky top-0 opacity-100 backdrop-blur-md z-50 flex items-center justify-between w-full  sm:px-24 px-4 shrink-0 ">
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

            <div className={"md:flex  md:pl-0 pl-20 space-x-1 sm:space-x-2 md:space-x-4  md:space-y-0 space-y-2 "}>
                {salesforceId &&
            <button
                className="text-sm border border-red-500 text-red-500 hover:bg-opacity-75 hover:text-red-700 hover:border-red-700 font-bold py-1 px-4 rounded"
                onClick={() => setSalesforceInfo({refreshToken: "", salesforceId: ""})}
            >
            Logout
            </button>
                }
                <button
                    className=" text-sm  bg-blue-500 text-white hover:bg-blue-700 hover:text-white font-bold py-1 px-4 rounded"
                    onClick={() => {
                        window.open(`https://airtable.com/shrjRgKZ52rUOxemg`);
                    }}
                >
                    <span className="md:hidden">Drops</span>
                    <span className="hidden md:inline">Get notified of new drops</span>
                </button>



        </div>

    </div>
  </header>
);}
