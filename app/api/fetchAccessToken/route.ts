import { kv } from "@vercel/kv";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { sessionToken } = await req.json();
    const response = await fetch(
      "https://app.vessel.dev/api/auth/access-token",
      {
        headers: {
          "Content-Type": "application/json",
          "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
          "x-vessel-session-token": sessionToken,
        },
        method: "POST",
      },
    );
    const json = await response.json();
    const { accessToken } = json.result;
    console.log(accessToken);
    await kv.set(sessionToken, accessToken);
    return NextResponse.json({ success: true });
  } catch (err) {
    // console.log(err);
    return NextResponse.error();
  }
}
