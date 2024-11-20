import { format, addDays } from "date-fns";
import { makeRows } from "./lib/abc";
import { cn } from "./lib/cn";

//const PERIOD_LENGThS = [16, 16, 16, 16, 16, 20, 20, 7, 7, 7, 7, 7]

const { header, body } = makeRows(
  61,
  [16, 16, 16, 13, 13, 20, 20, 7, 7, 7, 7, 7]
);

function dateformat(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export default function App() {
  const date = new Date();
  return (
    <div className="flex justify-center">
      <div>
        <h1 className="text-center">ABC schedule</h1>
        <div className="py-4"></div>
        <table>
          <thead className="h-16">
            <tr>
              <th className="">day</th>
              {header.map((x) => (
                <th className="-rotate-45 capitalize">{x.toLowerCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, i) => (
              <tr>
                {/* 
                <td>{dateformat(addDays(date, i))}</td>
 */}
                <td>{i}</td>
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
function letterFromNumber(x: number) {
  if (x === 3) {
    return "C";
  } else if (x === 2) {
    return "B";
  } else {
    return "A";
  }
}
