import { NextResponse } from "next/server";

import va from "@vercel/analytics";
import {setCachedAuthData} from "@/shared/kv/cachedAuthData";
import {initCachedCount} from "@/shared/kv/cachedCount";

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
    const userId = userData.organization_id;

    va.track("login", { userId });

    await setCachedAuthData(refreshToken, {
      accessToken,
      instanceUrl,
    })

    await initCachedCount(userId)

    return NextResponse.json({ salesforceId: userId, refreshToken  });
  } catch (err) {
    console.log(err);
    return NextResponse.error();
  }
}
