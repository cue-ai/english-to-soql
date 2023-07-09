import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
export async function POST(req: Request) {
  const { vesselId, query } = await req.json();
  const accessToken = await kv.get(vesselId);

  if (!accessToken) return NextResponse.error();
  const response = await fetch(
    "https://app.vessel.dev/api/actions/salesforce/soql/query",
    {
      headers: {
        "Content-Type": "application/json",
        "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
        "x-vessel-access-token": accessToken as string,
      },
      body: JSON.stringify({
        query,
      }),
      method: "POST",
    },
  );

  const json = await response.json();

  return NextResponse.json(json);
}
