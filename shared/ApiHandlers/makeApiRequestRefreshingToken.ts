import { refreshAccessToken } from "./refreshAccessToken";
import { kv } from "@vercel/kv";
import { SalesforceAuthCache } from "@/shared/types/salesforceTypes";
export const makeApiRequestRefreshingToken = async (
  url: string,
  cachedRes: SalesforceAuthCache,
  salesforceId: string,
) => {
  const refreshToken = cachedRes?.refreshToken;
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${cachedRes?.accessToken}`,
    },
  });
  console.log(response.statusText);

  if (!response.ok) {
    const newAccessToken = await refreshAccessToken(refreshToken ?? "");
    cachedRes.accessToken = newAccessToken;
    kv.set(salesforceId, cachedRes);

    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cachedRes?.accessToken}`,
      },
    });
  }

  if (!response.ok) return null;
  return await response.json();
};
