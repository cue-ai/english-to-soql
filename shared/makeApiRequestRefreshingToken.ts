import { refreshAccessToken } from "@/shared/refreshAccessToken";
import { kv } from "@vercel/kv";
export const makeApiRequestRefreshingToken = async (
  url: string,
  cachedRes: any,
  salesforceId: string,
) => {
  const refreshToken = cachedRes?.refreshToken;
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${cachedRes?.accessToken}`,
    },
  });

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken(refreshToken ?? "");
    cachedRes.accessToken = newAccessToken;
    kv.set(salesforceId, cachedRes);
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cachedRes?.accessToken}`,
      },
    });
    if (!response.ok) throw null;
  }
  let data;
  if (!response.ok) data = { error: response.statusText };
  else data = await response.json();

  return data;
};
