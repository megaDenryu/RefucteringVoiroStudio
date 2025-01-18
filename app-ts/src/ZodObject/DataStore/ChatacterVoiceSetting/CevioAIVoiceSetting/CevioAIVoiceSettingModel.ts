import { z } from "zod";
export const CevioAIVoiceSettingModel = z.object({
  talker2V40: z
    .object({
      Cast: z.string().default(""),
      Volume: z.number().int().gte(0).lte(100).default(50),
      Speed: z.number().int().gte(0).lte(100).default(50),
      Tone: z.number().int().gte(0).lte(100).default(50),
      Alpha: z.number().int().gte(0).lte(100).default(50),
      ToneScale: z.number().int().gte(0).lte(100).default(50),
    })
    .optional(),
  talkerComponentArray2: z
    .object({ record: z.record(z.number().int()).default({}) })
    .optional(),
  読み上げ間隔: z.number().gte(0).lte(2).default(0),
});
export type CevioAIVoiceSettingModel = z.infer<typeof CevioAIVoiceSettingModel>;
