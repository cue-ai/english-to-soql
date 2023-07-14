import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { kv } from "@vercel/kv";
import { getSalesforceDescriptions } from "./getSalesforceDescriptions";
import { NextResponse } from "next/server";
import {
  CachedSalesforceData,
  CustomFieldsOnObject,
  CustomObject,
  SalesforceAuthCache,
} from "@/shared/types/salesforceTypes";
import * as process from "process";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, salesforceId } = await req.json();
  const cachedRes: SalesforceAuthCache | null = await kv.get(salesforceId);
  if (!cachedRes) throw Error("No salesforce token");

  let cachedSalesforceData = (await kv.get(`${salesforceId}data`)) as string;

  let salesforceData: CachedSalesforceData;
  if (!cachedSalesforceData) {
    cachedSalesforceData = (await getSalesforceDescriptions(
      cachedRes?.accessToken as string,
      cachedRes?.refreshToken as string,
      cachedRes?.instanceUrl as string,
      salesforceId as string,
    )) as string;

    await kv.set(`${salesforceId}data`, cachedSalesforceData as string);
  }

  if (!cachedSalesforceData) {
    throw Error("No salesforce data even after regenerating access token");
  }

  const { stream, handlers } = LangChainStream();

  // check count
  const count: number = (await kv.get(`${salesforceId}count`)) as number;
  if (count >= 50 && salesforceId !== process.env.CUE_SALESFORCE_ID) {
    return new NextResponse(
      "You seem to have exceeded your free trial. Please contact christina@trycue.ai to ask me more questions.",
    );
  }
  if (typeof count === "undefined") throw Error("No count for some reason");
  await kv.set(`${salesforceId}count`, (count as number) + 1);

  const llm = new ChatOpenAI({
    modelName: "gpt-4",
    openAIApiKey: process.env.OPENAI_API_KEY,
    streaming: true,
  });

  // Needed because sometimes kv returns it as string, and sometimes as json
  try {
    salesforceData = JSON.parse(cachedSalesforceData);
  } catch (err) {
    salesforceData = cachedSalesforceData as unknown as CachedSalesforceData;
  }

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
          `Each query should be enclosed within triple backticks (\`\`\`). Do not prepend or append any text to the queries so that they can be ran without any changes. Also each response 
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
      return new StreamingTextResponse(stream, {
        status: 401,
        statusText: err?.message as string,
      });
    });

  return new StreamingTextResponse(stream);
}
