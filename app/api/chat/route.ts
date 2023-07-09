import { StreamingTextResponse, LangChainStream } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const getSalesforceDescriptions = async (accessToken: string) => {
  const response = await fetch(
    "https://app.vessel.dev/api/actions/salesforce/soql/query ",
    {
      headers: {
        "Content-Type": "application/json",
        "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
        "x-vessel-access-token": accessToken,
      },
      body: JSON.stringify({
        query:
          "SELECT  QualifiedApiName FROM EntityDefinition order by QualifiedApiName",
      }),
      method: "POST",
    },
  );

  const objects = await response.json();
  const objectNames: string[] =
    objects?.result?.records?.map((record: any) => record.qualifiedApiName) ??
    [];
  const customObjects: any = [];
  const customFields: any[] = [];
  await Promise.all(
    objectNames?.map(async (objectName) => {
      try {
        const describeData = await fetch(
          "https://app.vessel.dev/api/passthrough",
          {
            headers: {
              "Content-Type": "application/json",
              "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
              "x-vessel-access-token": accessToken,
            },
            body: JSON.stringify({
              method: "GET",
              path: `/sobjects/${objectName}/describe`,
            }),
            method: "POST",
          },
        );
        const fieldObject = await describeData.json();

        if (fieldObject?.result?.data?.custom) {
          const fields = fieldObject?.result?.data?.fields?.map(
            (field: any) => ({
              name: field?.name,
              type: field?.type,
            }),
          );
          customObjects.push({ objectName, fields });
        } else {
          const customFields = (fieldObject?.result?.data?.fields ?? [])
            ?.filter((field: any) => field.custom)
            .map((field: any) => {
              return {
                name: field.name,
                type: field.type,
              };
            });
          if (customFields?.length ?? 0 > 0)
            customFields.push({ name: objectName, customFields });
        }
      } catch (err) {
        console.log(err);
      }
    }),
  );
  console.log(customObjects);
  console.log(customFields);
  return JSON.stringify({ customObjects, customFields });
};

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
          `Each query should be enclosed within triple backticks (\`\`\`). Do not prepend or append any text to the queries so that they can be ran without any changes.`,
        ),
        new SystemChatMessage(`The data in the following messages carries information on all the user's custom salesforce objects. 
                Please use it when constructing queries if relevant.`),
        // ...documents,

        ...(salesforceData?.customObjects ?? []).map(
          (obj: any) =>
            new SystemChatMessage(JSON.stringify(obj).replace(/\s/g, "")),
        ),
        new SystemChatMessage(`The data in the following messages carries information on all the user's custom salesforce fields for each object. 
                Please use it when constructing queries if relevant. (You have access to the users data`),
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
