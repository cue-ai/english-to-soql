export const getSalesforceDescriptions = async (accessToken: string) => {
  const response = await fetch(
    "https://app.vessel.dev/api/actions/salesforce/soql/query ",
    {
      headers: {
        "Content-Type": "application/json",
        "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
        "x-vessel-access-token": accessToken,
      },
      body: JSON.stringify({
        query:
          "SELECT  QualifiedApiName FROM EntityDefinition order by QualifiedApiName",
      }),
      method: "POST",
    },
  );

  const objects = await response.json();
  const objectNames: string[] =
    objects?.result?.records?.map((record: any) => record.qualifiedApiName) ??
    [];
  const customObjects: any = [];
  const customFields: any[] = [];
  await Promise.all(
    objectNames?.map(async (objectName) => {
      try {
        const describeData = await fetch(
          "https://app.vessel.dev/api/passthrough",
          {
            headers: {
              "Content-Type": "application/json",
              "x-vessel-api-token": process.env.VESSEL_API_KEY ?? "",
              "x-vessel-access-token": accessToken,
            },
            body: JSON.stringify({
              method: "GET",
              path: `/sobjects/${objectName}/describe`,
            }),
            method: "POST",
          },
        );
        const fieldObject = await describeData.json();

        if (fieldObject?.result?.data?.custom) {
          const fields = fieldObject?.result?.data?.fields?.map(
            (field: any) => ({
              name: field?.name,
              type: field?.type,
            }),
          );
          customObjects.push({ objectName, fields });
        } else {
          const customFields = (fieldObject?.result?.data?.fields ?? [])
            ?.filter((field: any) => field.custom)
            .map((field: any) => {
              return {
                name: field.name,
                type: field.type,
              };
            });
          if (customFields?.length ?? 0 > 0)
            customFields.push({ name: objectName, customFields });
        }
      } catch (err) {
        console.log(err);
      }
    }),
  );
  console.log(customObjects);
  console.log(customFields);
  return JSON.stringify({ customObjects, customFields });
};
