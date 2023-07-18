import { refreshAccessToken } from "./refreshAccessToken";
import { kv } from "@vercel/kv";
import { SalesforceAuthCache } from "@/shared/types/salesforceTypes";
import {setCachedAuthData} from "@/shared/kv/cachedAuthData";
export const makeApiRequestRefreshingToken = async (
  url: string,
  cachedRes: SalesforceAuthCache,
  salesforceId: string,
  refreshToken:string
) => {
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${cachedRes?.accessToken}`,
    },
  });

  if (!response.ok) {
    const newAccessToken = await refreshAccessToken(refreshToken ?? "");
    cachedRes.accessToken = newAccessToken;
    // typed-cached Res is of type SalesforceAuthCache
    await setCachedAuthData(refreshToken,cachedRes)

    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cachedRes?.accessToken}`,
      },
    });
  }

  if (!response.ok) return null;
  return await response.json();
};
