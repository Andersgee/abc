import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { idb } from "../../db/client";

export const entryRouter = router({
  list: publicProcedure.query(async () => {
    return await idb.getAll("entry");
  }),
  create: publicProcedure
    .input(
      z.object({
        x: z.number(),
        y: z.number(),
        label: z.string(),
        comment: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await idb.add("entry", {
        x: input.x,
        y: input.y,
        comment: input.comment,
        label: input.label,
      });
    }),
  remove: publicProcedure
    .input(z.object({ key: z.number() }))
    .mutation(async ({ input }) => {
      //return await idb.delete("post", input.key);
      return 1;
    }),
  update: publicProcedure
    .input(z.object({ id: z.number(), label: z.string() }))
    .mutation(async ({ input }) => {
      return await idb.update("entry", { id: input.id, label: input.label });
      //return 1;
    }),
  search: publicProcedure
    .input(z.object({ value: z.string() }))
    .query(async ({ input }) => {
      //return await idb.filter("post", ({ text }) => text.includes(input.value));
      return 1;
    }),
});
