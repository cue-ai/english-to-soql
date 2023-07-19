"use client";
import {useContext} from "react";
import {SalesforceContext} from "@/components/organisms/Contexts/SalesforceContext";
import { useRouter } from 'next/navigation'

export const Header = () => {
    const router=useRouter()
    const {setSalesforceInfo,salesforceId}=useContext(SalesforceContext)
    return(
  <header className="sticky top-0 opacity-100 backdrop-blur-md z-50 flex items-center justify-between w-full  sm:px-24 px-4 shrink-0 ">
    <div className="pb-4 flex items-center justify-between space-x-2 w-full h-full border-b border-gray-500 border-opacity-50 font-bold text-white mt-10">
      <div
        className={"inline-block flex cursor-pointer"}
        onClick={() => {
             router.push('/')
        }}
      >
        <img src="/salesforceLogo.svg" alt="Logo" className={"mr-2"} />
        <h1>AskSalesforce</h1>
      </div>

            <div className={"flex"}>
                {salesforceId &&
            <button
                className="text-sm border border-red-500 text-red-500 hover:bg-opacity-75 hover:text-red-700 hover:border-red-700 font-bold py-1 px-4 rounded"
                onClick={() => setSalesforceInfo({refreshToken: "", salesforceId: ""})}
            >
            Logout
            </button>
                }
                <button
                    className="ml-4 text-sm  bg-blue-500 text-white hover:bg-blue-700 hover:text-white font-bold py-1 px-4 rounded"
                    onClick={() => {
                        window.open(`https://airtable.com/shrjRgKZ52rUOxemg`);
                    }}
                >
                    Get notified of new drops
                </button>



        </div>

    </div>
  </header>
);}
