import {FC} from "react";

type WelcomeBoxProps = {
  submitQuery: (arg: string) => void;
};
export const WelcomeBox:FC<WelcomeBoxProps> = ({ submitQuery }) => {
  return (
    <div
      className={"mb-10 border-2 rounded-md border-blue-900 p-8 bg-gray-900 lg:w-6/12 w-10/12"}
    >
      <h1 className={"text-white text-xl font-semibold"}>
        Welcome to AskSalesforce
      </h1>
      <p className={"text-sm text-slate-400 mt-8 "}>
        This is an open source tool to help you turn any question about your Salesforce data into a valid SOQL query,
        then run it on your Salesforce instance and get real results.
        Generate a sharable link for any query or download results into a CSV to collaborate with your team!
      </p>
      <p className={"text-sm text-slate-400 mt-8 hidden sm:block"}>
        You can ask a question, or use one of these example ones.
      </p>
      <p className={"text-sm text-slate-400 hidden sm:block"}> Note: Your first-ever request may take a couple of seconds.</p>

      <div className={"mt-6 space-y-4 hidden sm:block"}>
        <p
          className={"text-white text-sm cursor-pointer"}
          onClick={() => {
            submitQuery("Get all pending opportunity approvals");
          }}
        >
          → Get all pending opportunity approvals
        </p>
        <p
          className={"text-white text-sm cursor-pointer"}
          onClick={() => {
            submitQuery("Get the contacts where first name is undefined");
          }}
        >
          → Get the contacts where first name is undefined
        </p>
        <p
          className={"text-white text-sm cursor-pointer"}
          onClick={() => {
            submitQuery("Which Accounts do not have any associated Contacts");
          }}
        >
          → Which Accounts do not have any associated Contacts?
        </p>
        <p
          className={"text-white text-sm cursor-pointer"}
          onClick={() => {
            submitQuery(
              "What are all the Opportunities that have been closed in the last month?",
            );
          }}
        >
          → What are all the Opportunities that have been closed in the last
          month?
        </p>
      </div>
    </div>
  );
};
