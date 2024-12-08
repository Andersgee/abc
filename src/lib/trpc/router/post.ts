import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { idb } from "../../db/client";

export const postRouter = router({
  create: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      return await idb.add("post", { text: input.text });
    }),
  remove: publicProcedure
    .input(z.object({ key: z.number() }))
    .mutation(async ({ input }) => {
      return await idb.delete("post", input.key);
    }),
  update: publicProcedure
    .input(z.object({ key: z.number(), text: z.string() }))
    .mutation(async ({ input }) => {
      return await idb.update("post", { key: input.key, text: input.text });
    }),
  search: publicProcedure
    .input(z.object({ value: z.string() }))
    .query(async ({ input }) => {
      return await idb.filter("post", ({ text }) => text.includes(input.value));
    }),
});
