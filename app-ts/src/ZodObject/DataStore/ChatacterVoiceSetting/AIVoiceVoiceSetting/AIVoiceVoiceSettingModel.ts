import { z } from "zod";
export const AIVoiceVoiceSettingModel = z.object({
  声の調整方法: z.string().default("音声調整はAIVoiceのソフトの方でできます"),
});
export type AIVoiceVoiceSettingModel = z.infer<typeof AIVoiceVoiceSettingModel>;
