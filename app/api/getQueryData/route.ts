import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { CachedQueryResult } from "@/shared/types/salesforceTypes";
export async function GET(req: Request) {
  const params = new URLSearchParams(new URL(req.url).search);
  const queryId = params.get("queryId");
  const res: CachedQueryResult | null = await kv.get(queryId as string);
  if (!res) {
    return new NextResponse("Server Error", { status: 520 });
  }
  const code = res?.code;
  const userContent = res?.userContent;
  const result = res?.result;

  return NextResponse.json({ code, userContent, result });
}
