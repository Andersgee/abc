import { z } from "zod";

export const zTable4Id = z.object({ id: z.string() });
export const zTable4Content = z.object({
  hello: z.string(),
});

export const zTable4 = z.object({
  key: z.number(),
  //id: z.string(),
  hello: z.string(),
});

export const zPost = z.object({
  key: z.number(),
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Table4 = z.infer<typeof zTable4>;

export type DB = {
  table4: z.infer<typeof zTable4>;
  post: z.infer<typeof zPost>;
};
