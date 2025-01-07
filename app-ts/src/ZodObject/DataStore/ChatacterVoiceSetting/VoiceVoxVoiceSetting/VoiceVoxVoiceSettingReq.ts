import { z } from "zod";
export const VoiceVoxVoiceSettingReq = z.object({
  page_mode: z.string(),
  client_id: z.string(),
  character_id: z.string(),
});
export type VoiceVoxVoiceSettingReq = z.infer<typeof VoiceVoxVoiceSettingReq>;
