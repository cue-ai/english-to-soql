import {NextRequest, NextResponse} from "next/server";
import { CachedQueryResult } from "@/shared/types/salesforceTypes";
import {getCachedQuery} from "@/shared/kv/cachedQuery";

export async function GET(req: NextRequest) {
    const pathnameSegments = req.nextUrl.pathname.split('/');
    const id = pathnameSegments[pathnameSegments.length - 1];
    const res: CachedQueryResult | null = await getCachedQuery(id as string ??"");

    if (!res) {
        return new NextResponse("Server Error", { status: 520 });
    }
    const code = res?.code;
    const userContent = res?.userContent;
    const result = res?.result;

    return NextResponse.json({ code, userContent, result });
}
