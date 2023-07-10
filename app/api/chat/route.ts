import { StreamingTextResponse, LangChainStream } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { getSalesforceDescriptions } from "./getSalesforceDescriptions";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, vesselId } = await req.json();
  const accessToken = await kv.get(vesselId);
  let salesforceData: any = await kv.get(`${vesselId}data`);
  if (!salesforceData) {
    salesforceData = await getSalesforceDescriptions(accessToken as string);
    await kv.set(`${vesselId}data`, salesforceData as string);
  }
  if (!salesforceData) {
    return NextResponse.error();
  }
  const { stream, handlers } = LangChainStream();

  // const documents= (salesforceData??[]).map((obj:any)=> new Document({pageContent:JSON.stringify(obj)}))

  // console.log(salesforceData)
  const llm = new ChatOpenAI({
    modelName: "gpt-4",
    openAIApiKey: process.env.OPENAI_API_KEY,
    streaming: true,
  });
  // parse string
  try {
    salesforceData = JSON.parse(salesforceData);
  } catch (err) {
    //     do nothing
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
        new SystemChatMessage(`The data in the following messages carries information on all the user's custom salesforce objects. 
                Please use it when constructing queries if relevant. These are the only custom objects this user has and are the only custom ones you can refer to.`),
        // ...documents,

        ...(salesforceData?.customObjects ?? []).map(
          (obj: any) =>
            new SystemChatMessage(JSON.stringify(obj).replace(/\s/g, "")),
        ),
        new SystemChatMessage(`The data in the following messages carries information on all the user's custom salesforce fields for each object. 
                Please use it when constructing queries if relevant. These are the only custom fields this user has and are the only custom ones you can refer to (apart from these you must not include any queries ending in __c).
                As such, you have knowledge of the user's custom objects/fields, and can only use these.`),
        ...(salesforceData?.customFields ?? []).map(
          (obj: any) =>
            new SystemChatMessage(JSON.stringify(obj).replace(/\s/g, "")),
        ),
        ...messages.map((m: any) =>
          m.role === "user"
            ? new HumanChatMessage(m.content)
            : new AIChatMessage(m.content),
        ),
      ],
      {},
      [handlers],
    )
    .catch((err) => {
      console.log(err);
    });

  return new StreamingTextResponse(stream);
}
