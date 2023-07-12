export type SalesforceQueryResult = {
  totalSize: number;
  done: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  records: any[];
};

export type SalesforceField = {
  name: string;
  type: string;
  custom?: boolean;
};
export type CustomFieldsOnObject = {
  name: string;
  fields: SalesforceField[];
};

export type CustomObject = {
  objectName: string;
  fields: SalesforceField[];
};

export type SalesforceAuthCache = {
  accessToken: string;
  refreshToken: string;
  instanceUrl: string;
};

export type CachedSalesforceData = {
  customObjects: CustomObject[];
  customFields: CustomFieldsOnObject[];
};

export type CachedQueryResult = {
  code: string;
  userContent: string;
  result: SalesforceQueryResult;
};

export type SalesforceQueryResultWithError = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  result: SalesforceQueryResult;
};
