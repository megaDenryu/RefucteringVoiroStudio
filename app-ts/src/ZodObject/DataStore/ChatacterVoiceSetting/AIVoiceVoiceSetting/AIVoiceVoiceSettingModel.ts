import { z } from "zod";
export const AIVoiceVoiceSettingModel = z.object({
  読み上げ間隔: z.number().gte(0).lte(2).default(0),
  AIによる文章変換: z.enum(["無効", "ChatGPT"]).default("無効"),
});
export type AIVoiceVoiceSettingModel = z.infer<typeof AIVoiceVoiceSettingModel>;
