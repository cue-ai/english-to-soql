import { Button } from "@/components/ui/Button";
import {FC, useContext, useEffect, useState} from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatContext } from "./ChatContext";
import { SalesforceQueryResultWithError } from "@/shared/types/salesforceTypes";
import {Loading} from "@/components/atoms/loading/Loading";
import {SalesforceContext} from "@/components/organisms/Contexts/SalesforceContext";

type CodeBlockProps = {
  code: string;
  setQueryResult: (arg: SalesforceQueryResultWithError) => void;
  queryResult: SalesforceQueryResultWithError;
};

export const CodeBlock:FC<CodeBlockProps> = ({
  code,
  setQueryResult,
  queryResult,
}) => {
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);
  const {setSalesforceInfo,salesforceId, refreshToken}=useContext(SalesforceContext)
  const { append, isLoading } = useContext(ChatContext);

  const runQuery = async () => {
    try{
      setIsLoadingQuery(true);
      const res = await fetch("/api/query", {
        method: "POST",
        body: JSON.stringify({ salesforceId, query: code, refreshToken }),
      });
      const data = await res.json();
      const error = data?.error;
      const result = data;
      const instanceUrl = data?.instanceUrl;
      const isRanBefore: boolean = Object.keys(queryResult ?? {}).length !== 0;
      setQueryResult({ error, result, instanceUrl });
      setIsLoadingQuery(false);
      if (error && !isRanBefore) {
        const newId = uuidv4();
        await append({
          id: `redo${newId}`,
          createdAt: new Date(),
          content:
              "That last getQueryData didnt seem to work. PLease use a different strategy to give me a getQueryData that works. Note, if you are using " +
              "custom fields/objects that haven't been mentioned in prior messages, please try something new. (use only standard objects/fields plus the custom objects/fields" +
              " inputted in prior messages)",
          role: "user",
        });
      }
    }
    catch(err){
    //   sign user out
      setSalesforceInfo({refreshToken:"", salesforceId:""})
    }
  };

  useEffect(() => {
    if (Object.keys(queryResult ?? {}).length !== 0 || isLoading) return;
    runQuery();
  }, [isLoading]);

  return (
    <div
      className={`inline-block bg-gray-900 p-2 text-xs font-medium rounded-md text-slate-300 font-mono`}
    >
      {code}

      <div className={"flex mt-4"}>
        <Button
          className={
            "text-xs text-black py-0 bg-green-400 hover:bg-green-500 text-gray-800"
          }
          disabled={isLoadingQuery || isLoading}
          size={"xs"}
          onClick={runQuery}
        >
          {isLoadingQuery && (
            <Loading className={"w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-black"}/>
          )}
          {isLoadingQuery ? "Running" : "Run"}
        </Button>
      </div>
    </div>
  );
};
