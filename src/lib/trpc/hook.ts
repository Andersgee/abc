import { createTRPCReact } from "@trpc/react-query";
import type { IdbRouter } from "./router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const idbapi = createTRPCReact<IdbRouter>();

/** type utility, example: `type HelloInput = RouterInputs['example']['hello']` */
export type RouterInputs = inferRouterInputs<IdbRouter>;

/** type utility, example: `type HelloOutput = RouterOutputs['example']['hello']` */
export type RouterOutputs = inferRouterOutputs<IdbRouter>;
