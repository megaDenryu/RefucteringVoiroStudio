import { z } from "zod";
export const CoeiroinkVoiceSettingModel = z.object({
  スピード: z.number().gte(0.5).lte(2).default(1),
  ピッチ: z.number().gte(-0.15).lte(0.15).default(0),
  イントネーション: z.number().gte(0).lte(2).default(1),
  音量: z.number().gte(0).lte(2).default(1),
});
export type CoeiroinkVoiceSettingModel = z.infer<
  typeof CoeiroinkVoiceSettingModel
>;
