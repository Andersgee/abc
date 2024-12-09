import { router } from "../trpc";
import { entryRouter } from "./entry";

export const idbRouter = router({
  entry: entryRouter,
});

export type IdbRouter = typeof idbRouter;
