import { z } from "zod";
export const CoeiroinkVoiceSettingModel = z.object({
  speedScale: z.number().gte(0.5).lte(2).default(1),
  pitchScale: z.number().gte(-0.15).lte(0.15).default(0),
  intonationScale: z.number().gte(0).lte(2).default(1),
  volumeScale: z.number().gte(0).lte(2).default(1),
});
export type CoeiroinkVoiceSettingModel = z.infer<
  typeof CoeiroinkVoiceSettingModel
>;
