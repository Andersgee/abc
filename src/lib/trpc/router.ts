//import { db } from './db';
import { z } from "zod";
import { createCallerFactory, publicProcedure, router } from "./trpc";

export const appRouter = router({
  userList: publicProcedure
    .input(z.object({ hello: z.string() }))
    .query(async ({ input, ctx }) => {
      // Retrieve users from a datasource, this is an imaginary database
      //const users = await db.user.findMany();
      //
      //const users: User[]
      //return users;
      console.log("inside route userList");
      return `${input.hello}-world`;
    }),
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
