import { z } from "zod";
export const Talker2V40 = z.object({
  Cast: z.string().default(""),
  Volume: z.number().int().gte(0).lte(100).default(50),
  Speed: z.number().int().gte(0).lte(100).default(50),
  Tone: z.number().int().gte(0).lte(100).default(50),
  Alpha: z.number().int().gte(0).lte(100).default(50),
  ToneScale: z.number().int().gte(0).lte(100).default(50),
});
export type Talker2V40 = z.infer<typeof Talker2V40>;
