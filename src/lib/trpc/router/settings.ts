import { publicProcedure, router } from "../trpc";
import { idb } from "../../db/client";

async function getSettings() {
  return await idb.get("settings", 1);
}

export const settingsRouter = router({
  get: publicProcedure.query(async () => {
    const settings = await getSettings();
    if (!settings) {
      await idb.add("settings", { isEditing: false, showComments: false });
      return await getSettings();
    }
    return settings;
  }),
  toggleIsEditing: publicProcedure.mutation(async () => {
    const settings = await getSettings();
    if (!settings) {
      await idb.add("settings", { isEditing: true, showComments: false });
      return true;
    } else {
      settings.isEditing = !settings.isEditing;
      await idb.update("settings", settings);
      return settings.isEditing;
    }
  }),
  toggleShowComments: publicProcedure.mutation(async () => {
    const settings = await getSettings();
    if (!settings) {
      await idb.add("settings", { isEditing: false, showComments: true });
      return true;
    } else {
      settings.showComments = !settings.showComments;
      await idb.update("settings", settings);
      return settings.showComments;
    }
  }),
});
