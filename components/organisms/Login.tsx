import { Button } from "@/components/ui/Button";
export const Login = () => {
  return (
    <div className={"w-full h-full text-center"}>
      <h1 className="text-7xl font-semibold  bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/20">
        AskSalesforce.ai
      </h1>

      <p
        className={
          "font-medium  mx-auto mt-8 w-8/12 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50"
        }
      >
        Supercharge your team’s productivity with our free English to SOQL tool
        that makes Salesforce querying a breeze. Say hello to seamless data
        management and lightning-fast insights.
      </p>

      <div
        className={
          "mt-8 mx-auto w-7/12 border-2 rounded-md border-blue-900 py-16 bg-gray-900"
        }
      >
        <h1 className={"text-gray-300"}>Login to generate SOQL </h1>
        <Button
          style={{ backgroundColor: "#1F264B" }}
          className={"mt-4 "}
          size={"sm"}
        >
          Connect your Salesforce
        </Button>
      </div>
    </div>
  );
};
