import { z } from "zod";
export const SerifSettingModel = z.object({
  AIによる文章変換: z.enum(["無効", "ChatGPT", "Gemini"]).default("無効"),
  読み上げ間隔: z.number().gte(0).lte(2).default(0),
});
export type SerifSettingModel = z.infer<typeof SerifSettingModel>;
