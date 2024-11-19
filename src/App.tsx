import { format, addDays } from "date-fns";
import { makeRows } from "./lib/abc";
import { cn } from "./lib/cn";

//const PERIOD_LENGThS = [20, 20, 16, 16, 16, 16, 16, 7, 7, 7, 7, 7]

const { header, body } = makeRows(
  64,
  [20, 20, 16, 16, 16, 16, 16, 7, 7, 7, 7, 7]
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
                          x === 3 && "text-red-700",
                          x === 2 && "text-orange-700",
                          x === 1 && "text-green-700"
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
