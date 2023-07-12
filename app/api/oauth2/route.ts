import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(req: Request) {
  const { code } = await req.json();

  try {
    const res = await fetch(
      "https://login.salesforce.com/services/oauth2/token",

      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.SALESFORCE_CLIENT_ID ?? "",
          client_secret: process.env.SALESFORCE_CLIENT_SECRET ?? "",
          redirect_uri: process.env.SALESFORCE_REDIRECT_URI ?? "",
          code,
        }).toString(),
      },
    );
    const data = await res.json();
    console.log(data);
    const {
      access_token: accessToken,
      instance_url: instanceUrl,
      refresh_token: refreshToken,
      signature,
    } = data;

    console.log(signature, accessToken, instanceUrl, refreshToken);
    kv.set(signature, {
      accessToken,
      instanceUrl,
      refreshToken: refreshToken,
    });

    return NextResponse.json({ salesforceId: signature });
  } catch (err) {
    console.log(err);
    return NextResponse.error();
  }
}
