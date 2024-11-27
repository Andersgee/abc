import { createTRPCReact } from "@trpc/react-query";
import type { IdbRouter } from "./router";

export const api = createTRPCReact<IdbRouter>();
