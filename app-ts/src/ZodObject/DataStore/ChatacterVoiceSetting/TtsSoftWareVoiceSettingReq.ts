import { z } from "zod";
export const TtsSoftWareVoiceSettingReq = z.object({
  page_mode: z.string(),
  client_id: z.string(),
  character_id: z.string(),
  saveID: z.string(),
});
export type TtsSoftWareVoiceSettingReq = z.infer<
  typeof TtsSoftWareVoiceSettingReq
>;
