import { makeApiRequestRefreshingToken } from "@/shared/ApiHandlers/makeApiRequestRefreshingToken";
import {
  CustomFieldsOnObject,
  SalesforceField,
  SalesforceQueryResult,
} from "@/shared/types/salesforceTypes";
import { CustomObject } from "@/shared/types/salesforceTypes";

export const getSalesforceDescriptions = async (
  accessToken: string,
  refreshToken: string,
  instanceUrl: string,
  salesforceId: string,
) => {
  const query =
    "SELECT QualifiedApiName FROM EntityDefinition order by QualifiedApiName";
  const encodedQuery = encodeURIComponent(query);

  const data: SalesforceQueryResult | null =
    await makeApiRequestRefreshingToken(
      `${instanceUrl}/services/data/v53.0/query?q=${encodedQuery}`,
      { accessToken, refreshToken, instanceUrl },
      salesforceId,
    );

  if (!data) return null;
  const objectNames: string[] = data.records.map(
    (record: { QualifiedApiName: string }) => record.QualifiedApiName,
  );

  const fieldObjects = await Promise.all(
    objectNames.map(async (objectName) => {
      try {
        return await makeApiRequestRefreshingToken(
          `${instanceUrl}/services/data/v53.0/sobjects/${objectName}/describe`,
          { accessToken, refreshToken, instanceUrl },
          salesforceId,
        );
      } catch (err) {
        console.log(err);
      }
    }),
  );

  const customObjects: CustomObject[] = fieldObjects
    .filter((fieldObject) => fieldObject?.custom)
    .map((fieldObject) => {
      const fields = fieldObject?.fields?.map((field: SalesforceField) => ({
        name: field?.name,
        type: field?.type,
      }));

      return { objectName: fieldObject?.name, fields };
    });

  let customFields: CustomFieldsOnObject[] = fieldObjects.map((fieldObject) => {
    const customFields = fieldObject?.fields.filter(
      (field: SalesforceField) => field.custom,
    );

    return { fields: customFields, name: fieldObject?.name };
  });
  customFields = customFields.filter(
    (customField) => customField.fields.length > 0,
  );

  return JSON.stringify({ customObjects, customFields });
};
