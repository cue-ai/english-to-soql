import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import Vessel from "@vesselapi/client-sdk";

export type LoginProps = {
  setVesselId: (arg: string) => void;
};
export const Login = ({ setVesselId }: LoginProps) => {
  // this is weird, only works when i initialise open like below for some reason
  const [isLoading, setIsLoading] = useState(false);
  let open: any = null;
  if (typeof document !== "undefined") {
    // you are safe to use the "document" object here
    open = Vessel({
      onSuccess: async (sessionToken) => {
        // get the access token
        await fetch("/api/fetchAccessToken", {
          method: "POST",
          body: JSON.stringify({ sessionToken }),
        });
        localStorage.setItem("vesselId", sessionToken);
        setVesselId(sessionToken);
        setIsLoading(false);
      },
      onLoad: () => console.log("loaded"),
      onClose: () => console.log("closed"),
    }).open;
  }

  const handleSalesforceLogin = async () => {
    setIsLoading(true);
    if (!open) return;
    await open({
      integrationId: "salesforce",
      getSessionToken: async () => {
        const response = await fetch("/api/fetchSessionToken", {
          method: "POST",
        });
        const json = await response.json();
        return json?.sessionToken;
      },
    });
  };

  useEffect(() => {
    const tempVesselId = localStorage.getItem("vesselId");
    if (tempVesselId) {
      setVesselId?.(tempVesselId);
    }
  }, []);

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
          onClick={handleSalesforceLogin}
        >
          {isLoading && (
            <svg
              aria-hidden="true"
              className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-black"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
          {isLoading ? "Connecting" : "Connect your Salesforce"}
        </Button>
      </div>
    </div>
  );
};
