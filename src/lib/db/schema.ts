import { z } from "zod";

export const zTable4Id = z.object({ id: z.string() });
export const zTable4Content = z.object({
  hello: z.string(),
});

export const zTable4 = zTable4Id.merge(zTable4Content);
export type Table4 = z.infer<typeof zTable4>;
