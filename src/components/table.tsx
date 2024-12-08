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

function indexArray(length: number) {
  return Array.from({ length }, (_, i) => i);
}

function getGridSize(entires: Entry[]): [number[], number[]] {
  let x = 0;
  let y = 0;
  for (const entry of entires) {
    x = Math.max(x, entry.x);
    y = Math.max(y, entry.y);
  }
  return [indexArray(x + 1), indexArray(y + 1)];
}

export function Table() {
  const [X, Y] = getGridSize(entries);

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
