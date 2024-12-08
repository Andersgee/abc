import { Idb } from "./idb";
import type { DB } from "./schema";

export const idb = new Idb<DB>();
