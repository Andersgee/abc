import { sleep } from "../../../utils/sleep";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { nestedRouter } from "./nested";
import { table4Router } from "./table4";

export const idbRouter = router({
  table4: table4Router,
  greeting: publicProcedure.query(async () => {
    await sleep(2000);
    return { hello: "from router" };
  }),
  mut: publicProcedure
    .input(z.object({ stuff: z.string() }))
    .mutation(async ({ input }) => {
      await sleep(2000);
      return { echoed_mutation_input: input };
    }),
  nested: nestedRouter,
});

export type IdbRouter = typeof idbRouter;
