import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { getSalesforceDescriptions } from "@/shared/getSalesforceDescriptions";
import { NextResponse } from "next/server";
import {
  CachedSalesforceData,
  CustomFieldsOnObject,
  CustomObject,
  SalesforceAuthCache,
} from "@/shared/types/salesforceTypes";
import * as process from "process";
import {parseJsonString} from "./parseJsonString";
import {getCachedAuthData} from "@/shared/kv/cachedAuthData";
import {getCachedSalesforceData,setCachedSalesforceData} from "@/shared/kv/cachedSalesforceData";
import {getCachedCount, incrementCachedCount} from "@/shared/kv/cachedCount";

// export const runtime = "edge";

const MAX_COUNT=50;
export async function POST(req: Request) {

  const { messages, salesforceId,refreshToken } = await req.json();
  const cachedRes: SalesforceAuthCache | null = await getCachedAuthData(refreshToken);
  if (!cachedRes) throw Error("No salesforce token");

  let cachedSalesforceData = await getCachedSalesforceData(refreshToken) as string;


  if (!cachedSalesforceData) {
    cachedSalesforceData = (await getSalesforceDescriptions(
      cachedRes?.accessToken as string,
      refreshToken as string,
      cachedRes?.instanceUrl as string,
      salesforceId as string,
    )) as string;
    await setCachedSalesforceData(refreshToken,cachedSalesforceData as string)
  }

  if (!cachedSalesforceData) {
    throw Error("No salesforce data even after regenerating access token");
  }

  const { stream, handlers } = LangChainStream();

  // check count
  const count = await getCachedCount(salesforceId);
  if (count >= MAX_COUNT && salesforceId !== process.env.CUE_SALESFORCE_ID) {
    return new NextResponse(
      "You seem to have exceeded your free trial. Please contact christina@trycue.ai to ask me more questions.",
    );
  }
  if (typeof count === "undefined") throw Error("No count for some reason");
  await incrementCachedCount(salesforceId);

  const llm = new ChatOpenAI({
    modelName: "gpt-4",
    openAIApiKey: process.env.OPENAI_API_KEY,
    streaming: true,
  });


    const salesforceData:CachedSalesforceData=parseJsonString(cachedSalesforceData)
    

  llm
    .call(
      [
        new SystemChatMessage(
          `You are a language learning model with a highly specialized task. 
          Your main purpose is to convert natural language into Salesforce Object Query Language (SOQL) queries. 
          You're given two crucial inputs: a list of custom Salesforce objects, and a list of custom fields on 
          standard Salesforce objects. Understanding and interpreting these inputs will facilitate your core functionality. 
          Your responsibility is to grasp and process the provided natural language, analyze it in the context of the 
          Salesforce objects and fields given (as well as standard Salesforce Objects and Fields), and transform it into an accurate SOQL query. Remember, each word, phrase, 
          or sentence in the provided natural language can serve as a valuable hint or instruction for your translation task. 
          Your ultimate goal is to translate the human-friendly language into a machine-friendly SOQL query, 
          bridging the gap between natural expression and technical syntax.`,
        ),

        new SystemChatMessage(
          `Each query should be enclosed within triple backticks (\`\`\`). Do not prepend or append any text to the queries so that they can be ran without any changes. Also it is of the utmost importance that each response 
          should carry at most one query`,
        ),
        new SystemChatMessage(`The data in the following messages carries information on all the user's custom salesforce objects. 
                Please use it when constructing queries if relevant. These are the only custom objects this user has and are the only custom ones you can refer to.`),
        ...(salesforceData?.customObjects ?? []).map(
          (obj: CustomObject) =>
            new SystemChatMessage(JSON.stringify(obj).replace(/\s/g, "")),
        ),
        new SystemChatMessage(`The data in the following messages carries information on all the user's custom salesforce fields for each standard object. 
                Please use it when constructing queries if relevant. These are the only custom fields this user has and are the only custom ones you can refer to (apart from these you must not include any queries ending in __c).
               `),
        ...(salesforceData?.customFields ?? []).map(
          (obj: CustomFieldsOnObject) =>
            new SystemChatMessage(JSON.stringify(obj).replace(/\s/g, "")),
        ),
        ...messages.map((m: Message) =>
          m.role === "user"
            ? new HumanChatMessage(m.content)
            : new AIChatMessage(m.content),
        ),
      ],
      {},
      [handlers],
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((err: any) => {
        console.error(err?.message as string)
      return new StreamingTextResponse(stream, {
        status: 401,
        statusText: err?.message as string,
      });
    });

  return new StreamingTextResponse(stream);
}
