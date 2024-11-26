const a = {
  RUN: [
    0,
    "A",
    "B (hard)",
    "A",
    0,
    "C (long)",
    "A",
    0,
    "A",
    "B (hard)",
    "A",
    0,
    "C (long)",
    "A",
  ],
};
/*
0 Monday: off 
A Tuesday: 45mins 
B Wednesday: 90mins (1hr 30mins) 
A Thursday: 45mins 
0 Friday: off 
C Saturday: 135mins (2hrs 15mins) 
A Sunday: 45mins 
*/
const ABC_SCHEDULE: Array<{
  bodypart: string;
  schedule: Array<string | number>;
  offset: number;
}> = [
  {
    offset: -1,
    bodypart: "RUN",
    schedule: [
      0,
      "A",
      "B (hard)",
      "A",
      0,
      "C (long)",
      "A",
      0,
      "A",
      "B (hard)",
      "A",
      0,
      "C (long)",
      "A",
    ],
  },
  {
    offset: 0,
    bodypart: "UPBACK",
    schedule: ["A", 0, 0, "B", 0, 0, 0, "C", 0, 0, 0, 0, "B", 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "SHOULDERS",
    schedule: ["A", 0, 0, "B", 0, 0, 0, "C", 0, 0, 0, 0, "B", 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "BICEPS",
    schedule: ["A", 0, 0, "B", 0, 0, 0, "C", 0, 0, 0, 0, "B", 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "CHEST",
    schedule: ["A", 0, 0, "B", 0, 0, 0, "C", 0, 0, 0, 0, "B", 0, 0, 0],
  },

  {
    offset: 0,
    bodypart: "TRICEPS",
    schedule: ["A", 0, 0, "B", 0, 0, 0, "C", 0, 0, 0, 0, "B", 0, 0, 0],
  },

  {
    offset: 0,
    bodypart: "QUADS",
    schedule: [
      "A",
      0,
      0,
      0,
      "B",
      0,
      0,
      0,
      0,
      "C",
      0,
      0,
      0,
      0,
      0,
      "B",
      0,
      0,
      0,
      0,
    ],
  },
  {
    offset: 0,
    bodypart: "HAMS",
    schedule: [
      "A",
      0,
      0,
      0,
      "B",
      0,
      0,
      0,
      0,
      "C",
      0,
      0,
      0,
      0,
      0,
      "B",
      0,
      0,
      0,
      0,
    ],
  },
  {
    offset: 0,
    bodypart: "TRAPS",
    schedule: ["A", 0, 0, "A", 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "LOWBACK",
    schedule: ["A", 0, 0, "B", 0, 0, 0],
  },

  {
    offset: 0,
    bodypart: "MIDSECTION",
    schedule: ["A", 0, 0, "A", 0, 0, 0],
  },

  {
    offset: 0,
    bodypart: "CALFS",
    schedule: ["A", 0, 0, "A", 0, 0, 0],
  },
  {
    offset: 0,
    bodypart: "FOREARMS",
    schedule: ["A", 0, 0, "A", 0, 0, 0],
  },
];

export function makeRows(n: number, customOffsets?: number[]) {
  const X = ABC_SCHEDULE.length;
  const Y = n;

  const header = ABC_SCHEDULE.map((x) => x.bodypart);
  const body: Array<string | number>[] = Array.from({ length: Y });

  for (let y = 0; y < Y; y++) {
    body[y] = Array.from({ length: X });
    for (let x = 0; x < X; x++) {
      const part = ABC_SCHEDULE[x];
      const schedule = part.schedule;
      const customOffset = customOffsets?.[x] ?? 0;
      body[y][x] =
        schedule[mod(y + part.offset + customOffset, schedule.length)];
    }
  }
  return { header, body, ABC_SCHEDULE };
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
