import {setCachedQuery} from "@/shared/kv/cachedQuery";
import {NextResponse} from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { code, userContent, result,salesforceId } = await req.json();

        const queryId = await setCachedQuery(salesforceId,{ code, userContent, result } )

        return NextResponse.json({ queryId });
    } catch (err) {
        return new NextResponse("Server Error", { status: 520 });
    }
}

