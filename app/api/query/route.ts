import { NextResponse } from "next/server";
import { makeApiRequestRefreshingToken } from "@/shared/ApiHandlers/makeApiRequestRefreshingToken";
import { SalesforceAuthCache } from "@/shared/types/salesforceTypes";
import {getCachedAuthData} from "@/shared/kv/cachedAuthData";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { salesforceId, query, refreshToken } = await req.json();

        const cachedRes: SalesforceAuthCache | null = await getCachedAuthData(refreshToken)
        if (!cachedRes) return new NextResponse("Unauthorized", { status: 401 });
        const encodedQuery = encodeURIComponent(query);

        let json = await makeApiRequestRefreshingToken(
            `${cachedRes.instanceUrl}/services/data/v53.0/query?q=${encodedQuery}`,
            cachedRes,
            salesforceId,
            refreshToken
        );
        if (!json) {
            json = { error: "Invalid getQueryData" };
        }

        return NextResponse.json({ ...json, instanceUrl: cachedRes.instanceUrl });
    } catch (err) {
        return new NextResponse("Server Error", { status: 520 });
    }
}
