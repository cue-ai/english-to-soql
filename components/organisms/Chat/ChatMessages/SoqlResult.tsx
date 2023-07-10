import { isObject } from "radash";

type ResultTableProps = {
  error: any;
  result: any;
};

export const SoqlResult = ({ error, result }: ResultTableProps) => {
  console.log(error);
  if (error) {
    return (
      <h1 className={"font-semibold text-red-500"}>
        Error running query, Retrying request.
      </h1>
    );
  }
  const records: any[] = result?.records;
  const keys = Object.keys(records?.[0] ?? {}).filter(
    (key) => !isObject(records[0][key]),
  );
  if (records?.length === 0) {
    return <h1 className={"font-semibold text-white"}>No records found</h1>;
  }
  return (
    <table className=" max-w-full table-auto border-collapse border border-gray-500">
      <thead>
        <tr className={"bg-slate-900"}>
          {keys.map((key) => (
            <th className="border  border-gray-500 px-4 py-2" key={key}>
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records?.map((item, index) => (
          <tr key={index} className={"bg-slate-900 text-start"}>
            {keys.map((key) => (
              <td
                className="border border-gray-500 px-4 py-2 text-xs"
                key={key}
              >
                {item[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
