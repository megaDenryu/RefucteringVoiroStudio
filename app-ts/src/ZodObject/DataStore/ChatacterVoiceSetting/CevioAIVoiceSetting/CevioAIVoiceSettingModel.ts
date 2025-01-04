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
    .object({
      array: z
        .array(
          z.object({
            Id: z.string().describe("変更不可"),
            Name: z.string().describe("変更不可"),
            Value: z.number().int().gte(0).lte(100).default(50),
          }),
        )
        .default([]),
    })
    .optional(),
});
export type CevioAIVoiceSettingModel = z.infer<typeof CevioAIVoiceSettingModel>;
