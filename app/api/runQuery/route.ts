import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { makeApiRequestRefreshingToken } from "@/shared/makeApiRequestRefreshingToken";

export async function POST(req: Request) {
  const { salesforceId, query } = await req.json();
  const cachedRes: any = await kv.get(salesforceId);
  if (!cachedRes) return NextResponse.error();
  const encodedQuery = encodeURIComponent(query);

  const json = await makeApiRequestRefreshingToken(
    `${cachedRes.instanceUrl}/services/data/v53.0/query?q=${encodedQuery}`,
    cachedRes,
    salesforceId,
  );

  return NextResponse.json(json);
}
