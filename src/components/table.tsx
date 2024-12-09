import { useRef } from "react";
import { idbapi, RouterOutputs } from "../lib/trpc/hook";
import { Input } from "./input";

/*
type Entry = {
  x: number;
  y: number;
  id: string;
  label: string;
  comment: string;
};

const entries: Entry[] = [
  {
    id: "a",
    x: 0,
    y: 0,
    label: "cell1",
    comment: "",
  },
  {
    id: "b",
    x: 1,
    y: 0,
    label: "cell2",
    comment: "",
  },
  {
    id: "c",
    x: 1,
    y: 1,
    label: "cell4",
    comment: "",
  },
];
*/
function indexArray(length: number) {
  return Array.from({ length }, (_, i) => i);
}

type Entry = RouterOutputs["entry"]["list"][number];

function getGridSize(entires: Entry[]): [number[], number[]] {
  if (entires.length == 0) return [indexArray(3), indexArray(3)];
  let x = 0;
  let y = 0;
  for (const entry of entires) {
    x = Math.max(x, entry.x);
    y = Math.max(y, entry.y);
  }
  return [indexArray(x + 1), indexArray(y + 1)];
}

export function Table() {
  const { data: entries } = idbapi.entry.list.useQuery();
  const [X, Y] = getGridSize(entries ?? []);

  if (entries === undefined) return null;
  return Y.map((y) => {
    return (
      <div key={y} className="flex gap-1 h-20 bg-red-200">
        {X.map((x) => {
          const cell = entries.filter((cell) => cell.y === y && cell.x === x);

          if (cell.length === 0) {
            return <ButtonAdd key={`${x}-${y}`} x={x} y={y} />;
          } else if (cell.length === 1) {
            const entry = cell[0]!;
            return (
              <div key={entry.id}>
                <InputPut {...entry} />
              </div>
            );
          } else {
            return (
              <div key={`${y}-${x}`} className="h-4 w-10 m-1 ">
                {cell.map((entry) => {
                  return <div key={entry.id}>{entry.label}</div>;
                })}
              </div>
            );
          }
        })}
      </div>
    );
  });
}

function ButtonAdd({ x, y }: { x: number; y: number }) {
  const utils = idbapi.useUtils();
  const { mutate: create } = idbapi.entry.create.useMutation({
    onSuccess: () => utils.entry.invalidate(),
  });
  return (
    <button
      onClick={() => {
        create({
          x,
          y,
          comment: "",
          label: "",
        });
      }}
    >
      +
    </button>
  );
}

function InputPut(entry: Entry) {
  const ref = useRef<HTMLInputElement>(null);

  const utils = idbapi.useUtils();
  const { mutate } = idbapi.entry.update.useMutation({
    onSuccess(data) {
      utils.entry.invalidate();
      console.log("put, onSuccess, data:", data);
    },
    onError(error) {
      console.log("put, onError, error:", error);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const str = ref.current?.value;
        if (str !== undefined) {
          mutate({ id: entry.id, label: str });
        }
      }}
    >
      <Input ref={ref} defaultValue={entry.label} className="w-56" />
    </form>
  );
}
