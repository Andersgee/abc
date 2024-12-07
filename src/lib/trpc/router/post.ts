import { z } from "zod";
import { dbadd, dbdelete, dbfilter, dbput } from "../../db/client";
import { publicProcedure, router } from "../trpc";
import { zPost } from "../../db/schema";

export const postRouter = router({
  create: publicProcedure.input(zPost).mutation(async ({ input }) => {
    return await dbadd("table4", input);
  }),
  remove: publicProcedure.input(zTable4Id).mutation(async ({ input }) => {
    return await dbdelete("table4", input.id);
  }),
  update: publicProcedure.input(zTable4).mutation(async ({ input }) => {
    return await dbput("table4", input);
  }),
  search: publicProcedure
    .input(z.object({ value: z.string() }))
    .query(async ({ input }) => {
      return await dbfilter("post", ({ text }) => text.includes(input.value));
    }),
});
