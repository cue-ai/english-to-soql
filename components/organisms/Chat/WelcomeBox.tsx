export const WelcomeBox = () => {
  return (
    <div
      className={"border-2 rounded-md border-blue-900 p-8 bg-gray-900 w-6/12"}
    >
      <h1 className={"text-white text-xl font-semibold"}>
        Welcome to AskSalesforce
      </h1>
      <p className={"text-sm text-slate-400 mt-8"}>
        This is an open source tool to help you turn any question about your
        salesforce data into a valid SOQL query, then run it on your salesforce
        instance and get real results.
      </p>
      <p className={"text-sm text-slate-400 mt-8"}>
        You can ask a question, or use one of these example ones.
      </p>

      <div className={"mt-6 space-y-4"}>
        <p className={"text-white text-sm cursor-pointer"}>
          → Get all pending opportunity approvals
        </p>
        <p className={"text-white text-sm cursor-pointer"}>
          → Get the contacts where first name is undefined
        </p>
        <p className={"text-white text-sm cursor-pointer"}>
          → Which Accounts do not have any associated Contacts?
        </p>
        <p className={"text-white text-sm cursor-pointer"}>
          → What are all the Opportunities that have been closed in the last
          month?
        </p>
      </div>
    </div>
  );
};