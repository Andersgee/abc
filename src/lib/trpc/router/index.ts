import { router } from "../trpc";
import { postRouter } from "./post";

export const idbRouter = router({
  post: postRouter,
});

export type IdbRouter = typeof idbRouter;
