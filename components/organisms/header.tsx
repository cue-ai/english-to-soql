"use client";
import * as process from "process";

export const Header = () => (
  <header className="absolute  top-0 z-50 flex items-center justify-between w-full h-14 px-24 shrink-0 ">
    <div className="flex items-center justify-start space-x-2 w-full h-full border-b border-gray-500 border-opacity-50 font-bold text-white mt-10">
      <div
        className={"inline-block flex cursor-pointer"}
        onClick={() => {
          window.location.href = process.env.NEXT_PUBLIC_FRONTEND_URL as string;
        }}
      >
        <img src="/salesforceLogo.svg" alt="Logo" className={"mr-2"} />
        <h1>AskSalesforce</h1>
      </div>
    </div>
  </header>
);
