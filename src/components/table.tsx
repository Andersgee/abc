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

const Y = [0, 1, 2, 3];

const X = [0, 1, 2, 3];

export function Table() {
  return Y.map((y) => {
    return (
      <div key={y} className="flex gap-1">
        {X.map((x) => {
          const cell = entries.filter((cell) => cell.y === y && cell.x === x);

          return (
            <div key={`${y}-${x}`} className="h-4 w-10 m-1 bg-red-300">
              {cell.map((entry) => {
                return <div key={entry.id}>{entry.label}</div>;
              })}
            </div>
          );
        })}
      </div>
    );
  });
}
