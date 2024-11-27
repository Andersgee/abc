import { sleep } from "../../../utils/sleep";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const nestedRouter = router({
  greeting: publicProcedure.query(async () => {
    await sleep(2000);
    return { hello: "from nested router" };
  }),
  mut: publicProcedure
    .input(z.object({ stuff: z.string() }))
    .mutation(async ({ input }) => {
      await sleep(2000);
      return { echoed_nested_mutation_input: input };
    }),
});
