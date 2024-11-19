const ABC_SCHEDULE: Array<{
  bodypart: string;
  schedule: number[];
  offset: number;
}> = [
  {
    offset: 0,
    bodypart: "QUADS",
    schedule: [1, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "HAMS",
    schedule: [1, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "CHEST",
    schedule: [1, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "SHOULDERS",
    schedule: [1, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "TRICEPS",
    schedule: [1, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "UPBACK",
    schedule: [1, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0],
  },

  {
    offset: 0,
    bodypart: "BICEPS",
    schedule: [1, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0],
  },

  {
    offset: 0,
    bodypart: "TRAPS",
    schedule: [1, 0, 0, 1, 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "LOWBACK",
    schedule: [1, 0, 0, 2, 0, 0, 0],
  },

  {
    offset: 0,
    bodypart: "MIDSECTION",
    schedule: [1, 0, 0, 1, 0, 0, 0],
  },

  {
    offset: 0,
    bodypart: "CALFS",
    schedule: [1, 0, 0, 1, 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "FOREARMS",
    schedule: [1, 0, 0, 1, 0, 0, 0],
  },
];

export function makeRows(n: number, customOffsets?: number[]) {
  const X = ABC_SCHEDULE.length;
  const Y = n;

  const header = ABC_SCHEDULE.map((x) => x.bodypart);
  const body: number[][] = Array.from({ length: Y });

  for (let y = 0; y < Y; y++) {
    body[y] = Array.from({ length: X });
    for (let x = 0; x < X; x++) {
      const part = ABC_SCHEDULE[x];
      const schedule = part.schedule;
      const customOffset = customOffsets?.[x] ?? 0;
      body[y][x] = schedule[(y + part.offset + customOffset) % schedule.length];
    }
  }
  return { header, body };
}
