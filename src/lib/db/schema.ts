import { z } from "zod";

export const zTable4Id = z.object({ id: z.string() });
export const zTable4Content = z.object({
  hello: z.string(),
});

export const zTable4 = z.object({
  id: z.string(),
  hello: z.string(),
});

export type Table4 = z.infer<typeof zTable4>;

export type DB = {
  table4: z.infer<typeof zTable4>;
};
