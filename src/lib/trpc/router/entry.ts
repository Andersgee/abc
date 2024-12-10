import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { idb } from "../../db/client";

export const entryRouter = router({
  list: publicProcedure.query(async () => {
    return await idb.getAll("entry");
  }),
  listBetweenDates: publicProcedure
    .input(z.object({ from: z.date(), to: z.date() }))
    .query(async ({ input }) => {
      const x = await idb.filter(
        "entry",
        (entry) => entry.y >= input.from && entry.y <= input.to
      );
      return x;
    }),
  create: publicProcedure
    .input(
      z.object({
        x: z.number(),
        y: z.date(),
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
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await idb.delete("entry", input.id);
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        label: z.string().optional(),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await idb.update("entry", input);
    }),
  //search: publicProcedure
  //  .input(z.object({ value: z.string() }))
  //  .query(async ({ input }) => {
  //    //return await idb.filter("post", ({ text }) => text.includes(input.value));
  //    return 1;
  //  }),
});
