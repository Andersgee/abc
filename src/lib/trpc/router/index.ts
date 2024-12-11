import { router } from "../trpc";
import { entryRouter } from "./entry";
import { settingsRouter } from "./settings";

export const idbRouter = router({
  entry: entryRouter,
  settings: settingsRouter,
});

export type IdbRouter = typeof idbRouter;
