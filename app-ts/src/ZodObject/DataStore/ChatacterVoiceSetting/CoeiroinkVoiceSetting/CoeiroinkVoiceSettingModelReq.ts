import { z } from "zod";
export const CoeiroinkVoiceSettingModelReq = z.object({
  page_mode: z.string(),
  client_id: z.string(),
  character_id: z.string(),
  coeiroinkVoiceSettingModel: z
    .object({
      スピード: z.number().gte(0.5).lte(2).default(1),
      ピッチ: z.number().gte(-0.15).lte(0.15).default(0),
      イントネーション: z.number().gte(0).lte(2).default(1),
      音量: z.number().gte(0).lte(2).default(1),
    })
    .optional(),
});
export type CoeiroinkVoiceSettingModelReq = z.infer<
  typeof CoeiroinkVoiceSettingModelReq
>;
