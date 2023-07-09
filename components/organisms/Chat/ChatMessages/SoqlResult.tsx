import { isObject } from "radash";

type ResultTableProps = {
  records: any[];
};

export const ResultTable = ({ records }: ResultTableProps) => {
  const keys = Object.keys(records?.[0] ?? {}).filter(
    (key) => !isObject(records[0][key]),
  );

  return (
    <table className="table-auto border-collapse border border-green-800">
      <thead>
        <tr>
          {keys.map((key) => (
            <th className="border border-green-600 px-4 py-2" key={key}>
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.map((item, index) => (
          <tr key={index}>
            {keys.map((key) => (
              <td className="border border-green-600 px-4 py-2" key={key}>
                {item[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
