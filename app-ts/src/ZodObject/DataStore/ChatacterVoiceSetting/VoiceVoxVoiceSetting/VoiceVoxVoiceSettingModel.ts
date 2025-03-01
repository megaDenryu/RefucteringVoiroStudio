import { z } from "zod";
export const VoiceVoxVoiceSettingModel = z.object({
  スピード: z
    .number()
    .gte(0.5)
    .lte(2)
    .describe("読み上げ速度を調整します。")
    .default(1),
  ピッチ: z.number().gte(-0.15).lte(0.15).default(0),
  イントネーション: z.number().gte(0).lte(2).default(1),
  音量: z.number().gte(0).lte(2).default(1),
});
export type VoiceVoxVoiceSettingModel = z.infer<
  typeof VoiceVoxVoiceSettingModel
>;
