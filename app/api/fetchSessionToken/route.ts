import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  console.log("hello");
  const response = await fetch(
    "https://app.vessel.dev/api/auth/session-token",
    {
      headers: {
        "Content-Type": "application/json",
        "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
      },
      method: "POST",
    },
  );

  const json = await response.json();
  return NextResponse.json(json.result);
}
