import {NextRequest, NextResponse} from "next/server";
import { CachedQueryResult } from "@/shared/types/salesforceTypes";
import {getCachedQuery} from "@/shared/kv/cachedQuery";

export const runtime = "edge";

export async function GET(req: NextRequest, {params}:{params:{id:string}}) {
    const {id} = params
    const res: CachedQueryResult | null = await getCachedQuery(id as string ??"");

    if (!res) {
        return new NextResponse("Server Error", { status: 520 });
    }

    return NextResponse.json({ ...res });
}
