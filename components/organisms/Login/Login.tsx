import {FC} from "react";

import * as process from "process";
import {cn} from "@/lib/utils";

export type LoginProps = {
  setIsFirst: (arg: boolean) => void;
  onlyLoginBox?: boolean;
};

export const Login:FC<LoginProps>= ({  onlyLoginBox }) => {
  return (
    <div className={"w-full h-full text-center"}>
      {!onlyLoginBox && (
        <>
          <h1 className="lg:text-7xl md:text-5xl sm: text-3xl font-semibold  bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/20">
            AskSalesforce.ai
          </h1>

          <p
            className={
              "lg:text-lg md:text-sm  font-medium  mx-auto mt-8 md:w-8/12 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50"
            }
          >
            Supercharge your team’s productivity with our free English to SOQL
            tool that makes Salesforce querying a breeze. Say hello to seamless
            data management and lightning-fast insights.
          </p>
        </>
      )}

      <div
        className={cn(!onlyLoginBox && "mt-8","mx-auto md:w-7/12 w-10/12 border-2 rounded-md border-blue-900 py-16 bg-gray-900")}
      >
        <h1 className={"text-gray-300"}>Login to generate SOQL </h1>
        <a
          className={
            "mt-3 text-sm inline-block bg-[#1F264B] hover:bg-[#1C2244] text-white font-bold py-1.5 px-3 rounded cursor-pointer"
          }
        href ={`https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SALESFORCE_REDIRECT_URI}`}

        >
          {"Connect your Salesforce"}
        </a>
      </div>
    </div>
  );
};
