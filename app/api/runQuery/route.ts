import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { makeApiRequestRefreshingToken } from "@/shared/ApiHandlers/makeApiRequestRefreshingToken";
import { SalesforceAuthCache } from "@/shared/types/salesforceTypes";

export async function POST(req: Request) {
  try {
    const { salesforceId, query } = await req.json();
    const cachedRes: SalesforceAuthCache | null = await kv.get(salesforceId);
    if (!cachedRes) return NextResponse.error();
    const encodedQuery = encodeURIComponent(query);

    const json = await makeApiRequestRefreshingToken(
      `${cachedRes.instanceUrl}/services/data/v53.0/query?q=${encodedQuery}`,
      cachedRes,
      salesforceId,
    );

    return NextResponse.json(json);
  } catch (err) {
    return new NextResponse("Server Error", { status: 520 });
  }
}
