import { z } from "zod";
export const AppSettingInitReq = z.object({
  page_mode: z.string(),
  client_id: z.string(),
});
export type AppSettingInitReq = z.infer<typeof AppSettingInitReq>;
