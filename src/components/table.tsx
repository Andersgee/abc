import { useRef } from "react";
import { idbapi, RouterOutputs } from "../lib/trpc/hook";
import { Input } from "./input";
import { Trash2 } from "lucide-react";

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
  return [indexArray(x + 2), indexArray(y + 2)];
}

export function Table() {
  const { data: entries } = idbapi.entry.list.useQuery();
  const [X, Y] = getGridSize(entries ?? []);

  if (entries === undefined) return null;
  return Y.map((y) => {
    return (
      <div key={y} className="flex gap-1">
        {X.map((x) => {
          const cell = entries.filter((cell) => cell.y === y && cell.x === x);

          if (cell.length === 0) {
            return (
              <div key={`${x}-${y}`} className="p-2 bg-yellow-500">
                <div className="flex">
                  <InputAdd x={x} y={y} />
                </div>
              </div>
            );
          } else if (cell.length === 1) {
            const entry = cell[0]!;
            return (
              <div key={entry.id} className="p-2 bg-orange-500">
                <div className="flex">
                  <InputUpdate {...entry} />
                  <ButtonRemove id={entry.id} />
                </div>
                <InputAdd x={x} y={y} />
              </div>
            );
          } else {
            return (
              <div
                key={`${y}-${x}-${cell.length}`}
                className="flex flex-col bg-purple-300 p-2"
              >
                {cell.map((entry) => (
                  <div key={entry.id} className="flex">
                    <InputUpdate {...entry} />
                    <ButtonRemove id={entry.id} />
                  </div>
                ))}
                <InputAdd x={x} y={y} />
              </div>
            );
          }
        })}
      </div>
    );
  });
}

function InputAdd({ x, y }: { x: number; y: number }) {
  const ref = useRef<HTMLInputElement>(null);

  const utils = idbapi.useUtils();
  const { mutate: create } = idbapi.entry.create.useMutation({
    onSuccess: () => utils.entry.invalidate(),
  });
  return (
    <div className="flex">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const str = ref.current?.value;
          if (str) {
            create({ x, y, label: str, comment: "" });
          }
        }}
      >
        <Input
          autoFocus={true}
          ref={ref}
          defaultValue=""
          className=""
          placeholder="new"
        />
      </form>
      <div className="w-10"></div>
    </div>
  );
}
function ButtonRemove({ id }: { id: number }) {
  const utils = idbapi.useUtils();
  const { mutate } = idbapi.entry.remove.useMutation({
    onSuccess: () => utils.entry.invalidate(),
  });
  return (
    <button
      onClick={() =>
        mutate({
          id,
        })
      }
    >
      <Trash2 className="w-8" />
    </button>
  );
}

function InputUpdate(entry: Entry) {
  const ref = useRef<HTMLInputElement>(null);

  const utils = idbapi.useUtils();
  const { mutate: update } = idbapi.entry.update.useMutation({
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
          update({ id: entry.id, label: str });
        }
      }}
    >
      <Input ref={ref} defaultValue={entry.label} className="" />
    </form>
  );
}
