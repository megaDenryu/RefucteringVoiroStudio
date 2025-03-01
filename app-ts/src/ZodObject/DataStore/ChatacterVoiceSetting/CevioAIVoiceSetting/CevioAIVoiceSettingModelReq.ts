import { z } from "zod";
export const CevioAIVoiceSettingModelReq = z.object({
  page_mode: z.string(),
  client_id: z.string(),
  character_id: z.string(),
  cevio_ai_voice_setting: z
    .object({
      コンディション: z
        .object({
          Cast: z.string().default(""),
          Volume: z.number().int().gte(0).lte(100).default(50),
          Speed: z.number().int().gte(0).lte(100).default(50),
          Tone: z.number().int().gte(0).lte(100).default(50),
          Alpha: z.number().int().gte(0).lte(100).default(50),
          ToneScale: z.number().int().gte(0).lte(100).default(50),
        })
        .optional(),
      感情: z
        .object({ record: z.record(z.number().int()).default({}) })
        .optional(),
    })
    .optional(),
});
export type CevioAIVoiceSettingModelReq = z.infer<
  typeof CevioAIVoiceSettingModelReq
>;
