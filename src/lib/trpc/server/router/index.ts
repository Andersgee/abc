import { sleep } from "../../../../utils/sleep";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

const nested = router({
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

export const appRouter = router({
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
  nested,
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;

//export const routerCaller = appRouter.createCaller({});

//const s = caller.greeting()
