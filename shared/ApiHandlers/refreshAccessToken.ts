export const refreshAccessToken = async (refreshToken: string) => {
  const refreshResponse = await fetch(
    "https://login.salesforce.com/services/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.SALESFORCE_CLIENT_ID ?? "",
        client_secret: process.env.SALESFORCE_CLIENT_SECRET ?? "",
        refresh_token: refreshToken,
      }).toString(),
    },
  );
  console.log(refreshResponse);
  if (!refreshResponse.ok) {
    throw null;
  }

  const refreshData = await refreshResponse.json();
  return refreshData.access_token;
};
