import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
export async function POST(req: Request) {
  try {
    const { code, userContent, result } = await req.json();

    const queryId = uuidv4();
    await kv.set(queryId, { code, userContent, result });

    return NextResponse.json({ queryId });
  } catch (err) {
    return new NextResponse("Server Error", { status: 520 });
  }
}
