import { isObject } from "radash";
import { SalesforceQueryResult } from "@/shared/types/salesforceTypes";
import {FC} from "react";

type ResultTableProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  result: SalesforceQueryResult;
  instanceUrl?: string;
};

export const SoqlResult:FC<ResultTableProps> = ({
  error,
  result,
  instanceUrl,
}) => {
  if (error) {
    return (
      <h1 className={"font-semibold text-red-500 font-mono"}>
        Error running query, Retrying request.
      </h1>
    );
  }

  const records = result?.records;
  const totalSize = result?.totalSize;
  const keys = Object.keys(records?.[0] ?? {}).filter(
    (key) => !isObject(records[0][key]),
  );

  if (records?.length === 0) {
    return totalSize ? (
      <h1 className={"font-medium text-white font-mono"}>{totalSize}</h1>
    ) : (
      <h1 className={"font-medium text-white font-mono"}>0 records found</h1>
    );
  }
  return (
    <table className=" max-w-full table-auto overflow-scroll border-collapse border border-gray-500 text-slate-400">
      <thead>
        <tr className={"bg-slate-900 cursor-pointer"}>
          {keys.map((key) => (
            <th className="border  border-gray-500 px-4 py-2" key={key}>
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records?.map((item, index) => (
          <tr
            key={item?.Id?? index}
            className={"bg-slate-900 text-start cursor-pointer"}
            onClick={() => {
              if (!instanceUrl) return;
              window.open(`${instanceUrl}/${item.Id}`);
            }}
          >
            {keys.map((key) => (
              <td
                className="border border-gray-500 px-4 py-2 text-xs"
                key={key}
              >
                {typeof item[key] !== "object" && item[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
