import { makeApiRequestRefreshingToken } from "@/shared/ApiHandlers/makeApiRequestRefreshingToken";
import {
  SalesforceField,
  SalesforceQueryResult,
} from "@/shared/types/salesforceTypes";
import {
  CustomObject,
  CustomFieldsOnObject,
} from "@/shared/types/salesforceTypes";

export const getSalesforceDescriptions = async (
  accessToken: string,
  refreshToken: string,
  instanceUrl: string,
  salesforceId: string,
) => {
  const query =
    "SELECT QualifiedApiName FROM EntityDefinition order by QualifiedApiName";
  const encodedQuery = encodeURIComponent(query);

  const data: SalesforceQueryResult = await makeApiRequestRefreshingToken(
    `${instanceUrl}/services/data/v51.0/query?q=${encodedQuery}`,
    { accessToken, refreshToken, instanceUrl },
    salesforceId,
  );
  if (!data) throw null;
  const objectNames: string[] = data.records.map(
    (record: { QualifiedApiName: string }) => record.QualifiedApiName,
  );

  const customObjects: CustomObject[] = [];
  const customFields: CustomFieldsOnObject[] = [];
  // we already know that the access token is valid
  await Promise.all(
    objectNames?.map(async (objectName) => {
      try {
        const fieldObject = await makeApiRequestRefreshingToken(
          `${instanceUrl}/services/data/v53.0/sobjects/${objectName}/describe`,
          { accessToken, refreshToken, instanceUrl },
          salesforceId,
        );

        if (fieldObject?.result?.data?.custom) {
          const fields = fieldObject?.result?.data?.fields?.map(
            (field: SalesforceField) => ({
              name: field?.name,
              type: field?.type,
            }),
          );
          customObjects.push({ objectName, fields });
        } else {
          const tempCustomFields: SalesforceField[] = (
            fieldObject?.result?.data?.fields ?? []
          )
            ?.filter((field: SalesforceField) => field.custom)
            .map((field: SalesforceField) => {
              return {
                name: field.name,
                type: field.type,
              };
            });
          if (customFields?.length ?? 0 > 0)
            customFields.push({ name: objectName, fields: tempCustomFields });
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
