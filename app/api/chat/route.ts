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

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, salesforceId } = await req.json();
  const cachedRes: SalesforceAuthCache | null = await kv.get(salesforceId);
  if (!cachedRes) throw Error("No salesforce token");

  let cachedSalesforceData = (await kv.get(`${salesforceId}data`)) as string;

  let salesforceData: CachedSalesforceData;
  if (!cachedSalesforceData) {
    cachedSalesforceData = await getSalesforceDescriptions(
      cachedRes?.accessToken as string,
      cachedRes?.refreshToken as string,
      cachedRes?.instanceUrl as string,
      salesforceId as string,
    );

    await kv.set(`${salesforceId}data`, cachedSalesforceData as string);
  }

  if (!cachedSalesforceData) {
    throw Error("No salesforce data even after regenerating access token");
  }

  const { stream, handlers } = LangChainStream();

  // check count
  const count: number = (await kv.get(`${salesforceId}count`)) as number;
  if (count >= 50) {
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
        new SystemChatMessage(`you are a tool thats main purpose is to convert natural language to Salesforce Object Query Language (SOQL) queries.
                With you, users can seamlessly interact with Salesforce data without needing to learn the intricacies of SOQL.
                All they need to do is clearly articulate what they want in plain language and you take care of the rest.
                You are specifically designed to understand these natural language expressions and adeptly convert them into accurate SOQL queries`),

        new SystemChatMessage(
          `Each query should be enclosed within triple backticks (\`\`\`). Do not prepend or append any text to the queries so that they can be ran without any changes. Also each response 
          should carry at most one query`,
        ),
        new SystemChatMessage(`NOTE: You are going to recieve information on all the custom salesforce fields/objects in the next couple of messages. Please use
        these and only these. Otherwise only refer to standard objects/fields. `),
        new SystemChatMessage(`The data in the following messages carries information on all the user's custom salesforce objects. 
                Please use it when constructing queries if relevant. These are the only custom objects this user has and are the only custom ones you can refer to.`),
        // ...documents,

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
