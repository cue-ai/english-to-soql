import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import va from "@vercel/analytics";

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
    } = data;

    const userRes = await fetch(`${instanceUrl}/services/oauth2/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = await userRes.json();
    const userId = userData.user_id;

    va.track("login", { userId });
    kv.set(userId, {
      accessToken,
      instanceUrl,
      refreshToken: refreshToken,
    });
    kv.set(`${userId}count`, 0);

    return NextResponse.json({ salesforceId: userId });
  } catch (err) {
    console.log(err);
    return NextResponse.error();
  }
}
