import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
export async function GET(req: Request) {
  const params = new URLSearchParams(new URL(req.url).search);
  const queryId = params.get("queryId");
  const res: any = await kv.get(queryId as string);

  if (!res) {
    return NextResponse.error();
  }
  const code = res?.code;
  const userContent = res?.userContent;
  const result = res?.result;

  return NextResponse.json({ code, userContent, result });
}
