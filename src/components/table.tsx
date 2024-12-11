import { useRef } from "react";
import { idbapi, RouterOutputs } from "../lib/trpc/hook";
import { Input } from "./input";
import { ChartBarIcon, Check, Pencil, Trash2 } from "lucide-react";

//import { create } from "zustand";
import { cn } from "../utils/cn";
import {
  format,
  addDays,
  subDays,
  isSameDay,
  startOfDay,
  isToday,
} from "date-fns";

function dateformat(date: Date) {
  return format(date, "yyyy-MM-dd");
}

/*
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
*/
function indexArray(length: number) {
  return Array.from({ length }, (_, i) => i);
}

type Entry = RouterOutputs["entry"]["list"][number];

/*
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
*/

function getX(entires: Entry[]): number[] {
  let x = 0;

  for (const entry of entires) {
    x = Math.max(x, entry.x);
  }
  return indexArray(x + 2);
}

export function Table() {
  const utils = idbapi.useUtils();
  const { mutate: toggleIsEditing } =
    idbapi.settings.toggleIsEditing.useMutation({
      onSuccess: () => utils.settings.invalidate(),
    });
  const { mutate: toggleShowComments } =
    idbapi.settings.toggleShowComments.useMutation({
      onSuccess: () => utils.settings.invalidate(),
    });

  return (
    <div className="">
      <div className="flex gap-2 sticky top-0 bg-white/80">
        <button onClick={() => toggleIsEditing()}>
          <Pencil className="size-10" />
        </button>
        <button onClick={() => toggleShowComments()}>
          <ChartBarIcon className="size-10" />
        </button>
      </div>
      <TableConent />
    </div>
  );
}

function TableConent() {
  const d = startOfDay(new Date());
  const from = subDays(d, 21);
  const to = addDays(d, 21);
  const { data: entries } = idbapi.entry.listBetweenDates.useQuery({
    from,
    to,
  });
  //const [X, Y] = getGridSize(entries ?? []);
  const X = getX(entries ?? []);
  const Y = indexArray(43);

  const { data: settings } = idbapi.settings.get.useQuery();

  if (entries === undefined) return null;

  return Y.map((y) => {
    const rowDate = addDays(from, y);
    return (
      <div
        key={y}
        className={cn(
          "flex items-center",
          isToday(rowDate) && "bg-blue-300",
          !settings?.isEditing && "h-10"
        )}
      >
        <div>{dateformat(rowDate)}</div>

        {X.map((x) => {
          const cellEntries = entries.filter(
            (cell) => cell.x === x && isSameDay(cell.y, rowDate)
          );

          return (
            <DisplayCellEntries
              key={`${y}-${x}`}
              entries={cellEntries}
              x={x}
              y={rowDate}
            />
          );
        })}
      </div>
    );
  });
}

function InputAdd({ x, y }: { x: number; y: Date }) {
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
            create({ x, y, label: str });
          }
        }}
      >
        <Input
          //autoFocus={true}
          ref={ref}
          defaultValue=""
          className=""
          placeholder=""
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

function CheckUpdateCompleted({ entry }: { entry: Entry }) {
  const utils = idbapi.useUtils();
  const { mutate: update } = idbapi.entry.update.useMutation({
    onSuccess: () => utils.entry.invalidate(),
  });

  return (
    <label>
      <input
        className="hidden"
        type="checkbox"
        checked={entry.completed}
        onChange={(e) => {
          update({ id: entry.id, completed: e.target.checked });
        }}
      />
      <Check
        strokeWidth={2.75}
        aria-checked={entry.completed ? "true" : undefined}
        className="aria-checked:bg-green-500 aria-checked:border-green-700 rounded-full 
        aria-checked:text-black hover:cursor-pointer border border-neutral-500 text-neutral-500"
      />
    </label>
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
        className="bg-neutral-50"
      />
    </form>
  );
}
function DisplayCellEntries({
  x,
  y,
  entries,
}: {
  x: number;
  y: Date;
  entries: Entry[];
}) {
  const { data: settings } = idbapi.settings.get.useQuery();

  return (
    <div className="flex flex-col items-center">
      {entries.map((entry) => (
        <DisplayEntry key={entry.id} entry={entry} />
      ))}
      {entries.length < 1 && settings?.isEditing && <InputAdd x={x} y={y} />}
    </div>
  );
}

function DisplayEntry({ entry }: { entry: Entry }) {
  const { data: settings } = idbapi.settings.get.useQuery();

  if (settings?.isEditing) {
    return (
      <div className="flex p-2 relative">
        <div className="flex flex-col">
          <div className="flex items-center">
            <CheckUpdateCompleted entry={entry} />
            <InputUpdateLabel entry={entry} />
          </div>

          {settings?.showComments && <InputUpdateComment entry={entry} />}
        </div>
        <ButtonRemove id={entry.id} className="absolute right-2 top-3.5" />
      </div>
    );
  }

  return (
    <div className="flex p-2 items-center">
      <div
        className={cn(
          "p-2 flex items-center",
          entry.label.includes(" C") && "bg-red-500",
          entry.label.includes(" B") && "bg-orange-400",
          entry.label.includes(" A") && "bg-green-300"
        )}
      >
        <CheckUpdateCompleted entry={entry} />
        {entry.label}
      </div>

      {settings?.showComments && <div>{entry.comment}</div>}
    </div>
  );
}
