import { useRef } from "react";
import { idbapi, RouterOutputs } from "../lib/trpc/hook";
import { Input } from "./input";
import { Pencil, Trash2 } from "lucide-react";

import { create } from "zustand";

interface BearState {
  isEditing: boolean;
  toggleIsEditing: () => void;
}

const useBearStore = create<BearState>()((set) => ({
  isEditing: false,
  toggleIsEditing: () => set((prev) => ({ isEditing: !prev.isEditing })),
}));

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
  const toggleIsEditing = useBearStore((s) => s.toggleIsEditing);
  return (
    <div>
      <button onClick={toggleIsEditing}>
        <Pencil />
      </button>
      <TableConent />
    </div>
  );
}

function TableConent() {
  const { data: entries } = idbapi.entry.list.useQuery();
  const [X, Y] = getGridSize(entries ?? []);

  if (entries === undefined) return null;
  return Y.map((y) => {
    return (
      <div key={y} className="flex">
        {X.map((x) => {
          const cellEntrues = entries.filter(
            (cell) => cell.y === y && cell.x === x
          );

          return <DisplayEntries entries={cellEntrues} x={x} y={y} />;
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
    <div className="flex p-2">
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

function InputUpdate({ entry }: { entry: Entry }) {
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

function DisplayEntries({
  x,
  y,
  entries,
}: {
  x: number;
  y: number;
  entries: Entry[];
}) {
  const isEditing = useBearStore((s) => s.isEditing);
  return (
    <div className="flex flex-col bg-blue-300">
      {entries.map((entry) => (
        <DisplayEntry entry={entry} />
      ))}
      {isEditing && <InputAdd x={x} y={y} />}
    </div>
  );
}

function DisplayEntry({ entry }: { entry: Entry }) {
  const isEditing = useBearStore((s) => s.isEditing);

  if (isEditing) {
    return (
      <div className="flex p-2">
        <InputUpdate entry={entry} />
        <ButtonRemove id={entry.id} />
      </div>
    );
  }

  return (
    <div className="flex p-2 bg-orange-200">
      <div>{entry.label}</div>
      <div>{entry.comment ?? "no comment"}</div>
    </div>
  );
}
