import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import Vessel from "@vesselapi/client-sdk";

export type LoginProps = {
  setVesselId: (arg: string) => void;
};
export const Login = ({ setVesselId }: LoginProps) => {
  // this is weird, only works when i initialise open like below for some reason
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
      },
      onLoad: () => console.log("loaded"),
      onClose: () => console.log("closed"),
    }).open;
  }

  const handleSalesforceLogin = async () => {
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
          Connect your Salesforce
        </Button>
      </div>
    </div>
  );
};
