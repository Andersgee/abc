import { format, addDays } from "date-fns";
import { makeRows } from "./lib/abc";
import { cn } from "./utils/cn";
import { useEffect, useRef, useState } from "react";
import { getItem, setItem, setup } from "./lib/idb";

import { Table2 } from "./table2";
import { TrpcProvider } from "./lib/trpc/provider";

//const PERIOD_LENGThS = [16, 16, 16, 16, 16, 20, 20, 7, 7, 7, 7, 7]

export default function App() {
  const didRun = useRef(false);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    /*
    openIndexedDB()
      .then((db) => {
        console.log(db);
      })
      .catch((err) => {
        console.log("catch, err:", err);
      });
*/
    if (!didRun.current) {
      void setup().then(() => setIsReady(true));
      didRun.current = true;
    }
  }, []);
  const [offsets, setOffsets] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const { header, body, ABC_SCHEDULE } = makeRows(61, offsets);

  const date = new Date("2024-11-24");
  const datestr = (i: number) => dateformat(addDays(date, i));

  if (!isReady) return null;

  return (
    <TrpcProvider>
      <Table2 />
    </TrpcProvider>
  );
  return (
    <div className="flex justify-center">
      <div>
        <div className="flex gap-4">
          <button
            className="bg-red-300"
            onClick={() => {
              getItem("Bill")
                .then((r) => console.log(r))
                .catch((err) => console.log(err));
            }}
          >
            get Bill
          </button>
          <button
            className="bg-red-300"
            onClick={() => {
              getItem("apa")
                .then((r) => console.log(r))
                .catch((err) => console.log(err));
            }}
          >
            get apa
          </button>
          <button
            className="bg-red-300"
            onClick={() => {
              setItem({ name: "Bill", other: "yep" })
                .then((r) => console.log(r))
                .catch((err) => console.log(err));
            }}
          >
            update Bill
          </button>
        </div>
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
              <td>period len</td>
              {ABC_SCHEDULE.map((b) => (
                <td>{b.schedule.length}</td>
              ))}
            </tr>
            <tr>
              <td>offset</td>
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
                    <div>{offsets[i]}</div>
                    <button
                      onClick={() => {
                        setOffsets((prev) => {
                          const k = prev.slice();

                          //k[i] = Math.max(0, k[i] - 1);
                          k[i] = k[i] - 1;
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
                <td>
                  {
                    datestr(i)
                    //i
                  }
                </td>
                {row.map((x) => {
                  if (typeof x === "string" && x.length > 0) {
                    const c = x.charAt(0);
                    return (
                      <td
                        className={cn(
                          "font-bold",
                          c === "C" && "bg-red-500 text-red-950",
                          c === "B" && "bg-orange-400 text-orange-800",
                          c === "A" && "bg-green-300 text-green-700"
                        )}
                      >
                        {x}
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
