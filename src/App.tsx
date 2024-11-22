import { format, addDays } from "date-fns";
import { makeRows } from "./lib/abc";
import { cn } from "./lib/cn";
import { useState } from "react";

//const PERIOD_LENGThS = [16, 16, 16, 16, 16, 20, 20, 7, 7, 7, 7, 7]

export default function App() {
  const [offsets, setOffsets] = useState([
    16, 16, 16, 16, 16, 20, 20, 7, 7, 7, 7, 7,
  ]);
  const { header, body } = makeRows(61, offsets);

  const date = new Date();
  const datestr = (i: number) => dateformat(addDays(date, i));

  return (
    <div className="flex justify-center">
      <div>
        <h1 className="text-center">ABC schedule</h1>
        <div className="py-4"></div>
        <table>
          <thead className="h-16">
            <tr>
              <th className="">day</th>
              {header.map((x, i) => (
                <th key={i} className="-rotate-45 capitalize">
                  {x.toLowerCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              {header.map((_x, i) => (
                <td key={i}>
                  <div className="flex flex-col">
                    <button
                      onClick={() => {
                        setOffsets((prev) => {
                          const k = prev.slice();
                          k[i] = k[i] + 1;
                          return k;
                        });
                      }}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => {
                        setOffsets((prev) => {
                          const k = prev.slice();

                          k[i] = Math.max(0, k[i] - 1);
                          return k;
                        });
                      }}
                    >
                      ↓
                    </button>
                  </div>
                </td>
              ))}
            </tr>
            {body.map((row, i) => (
              <tr key={i}>
                <td>{datestr(i)}</td>
                {row.map((x) => {
                  if (x) {
                    return (
                      <td
                        className={cn(
                          "font-bold",
                          x === 3 && "bg-red-500 text-red-950",
                          x === 2 && "bg-orange-400 text-orange-800",
                          x === 1 && "bg-green-300 text-green-700"
                        )}
                      >
                        {letterFromNumber(x)}
                      </td>
                    );
                  } else {
                    return <td></td>;
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function dateformat(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function letterFromNumber(x: number) {
  if (x === 3) {
    return "C";
  } else if (x === 2) {
    return "B";
  } else {
    return "A";
  }
}
