import { useRef } from "react";
import { idbapi, RouterOutputs } from "../lib/trpc/hook";
import { Input } from "./input";
import { ChartBarIcon, Pencil, Trash2 } from "lucide-react";

import { create } from "zustand";
import { cn } from "../utils/cn";

interface BearState {
  isEditing: boolean;
  showComments: boolean;
  toggleIsEditing: () => void;
  toggleComments: () => void;
}

const useBearStore = create<BearState>()((set) => ({
  isEditing: true,
  showComments: false,
  toggleIsEditing: () => set((prev) => ({ isEditing: !prev.isEditing })),
  toggleComments: () => set((prev) => ({ showComments: !prev.showComments })),
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
  const toggleComments = useBearStore((s) => s.toggleComments);
  return (
    <div>
      <button onClick={toggleIsEditing}>
        <Pencil />
      </button>
      <button onClick={toggleComments}>
        <ChartBarIcon />
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
          placeholder="label"
        />
      </form>
    </div>
  );
}
function ButtonRemove({ id, className }: { id: number; className?: string }) {
  const utils = idbapi.useUtils();
  const { mutate } = idbapi.entry.remove.useMutation({
    onSuccess: () => utils.entry.invalidate(),
  });
  return (
    <button
      className={className}
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

function InputUpdateLabel({ entry }: { entry: Entry }) {
  const ref = useRef<HTMLInputElement>(null);

  const utils = idbapi.useUtils();
  const { mutate: update } = idbapi.entry.update.useMutation({
    onSuccess: () => utils.entry.invalidate(),
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
      <Input
        ref={ref}
        defaultValue={entry.label}
        className={cn(
          entry.label.includes(" C") && "bg-red-500",
          entry.label.includes(" B") && "bg-orange-400",
          entry.label.includes(" A") && "bg-green-300"
        )}
      />
    </form>
  );
}

function InputUpdateComment({ entry }: { entry: Entry }) {
  const ref = useRef<HTMLInputElement>(null);

  const utils = idbapi.useUtils();
  const { mutate: update } = idbapi.entry.update.useMutation({
    onSuccess: () => utils.entry.invalidate(),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const str = ref.current?.value;
        if (str !== undefined) {
          update({ id: entry.id, comment: str });
        }
      }}
    >
      <Input
        ref={ref}
        defaultValue={entry.comment}
        placeholder="comment"
        className="bg-blue-100"
      />
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
      {entries.length < 1 && isEditing && <InputAdd x={x} y={y} />}
    </div>
  );
}

function DisplayEntry({ entry }: { entry: Entry }) {
  const isEditing = useBearStore((s) => s.isEditing);
  const showComments = useBearStore((s) => s.showComments);

  if (isEditing) {
    return (
      <div className="flex p-2 relative">
        <div className="flex flex-col">
          <InputUpdateLabel entry={entry} />

          {showComments && <InputUpdateComment entry={entry} />}
        </div>
        <ButtonRemove id={entry.id} className="absolute right-2 top-3.5" />
      </div>
    );
  }

  return (
    <div className="flex p-2 items-center">
      <div
        className={cn(
          "p-2",
          entry.label.includes(" C") && "bg-red-500",
          entry.label.includes(" B") && "bg-orange-400",
          entry.label.includes(" A") && "bg-green-300"
        )}
      >
        {entry.label}
      </div>
      <div>{entry.comment ?? "no comment"}</div>
    </div>
  );
}
