import { z } from "zod";
export const CharacterAISetting = z.object({
  名前: z.string(),
  年齢: z.number().int(),
  性別: z.string(),
  背景情報: z.string(),
  役割: z.string(),
  動機: z.string(),
  アリバイ: z.string(),
  性格特性: z.string(),
  関係: z.array(z.object({ 他のキャラクター名: z.string(), 関係: z.string() })),
  秘密: z.string(),
  知っている情報: z.string(),
  外見の特徴: z.string(),
  所持品: z.array(z.string()),
  行動パターン: z.array(
    z.object({
      感情: z.enum(["怒り", "喜び", "悲しみ", "不安", "恐怖", "驚き"]),
      行動: z.string(),
    }),
  ),
});
export type CharacterAISetting = z.infer<typeof CharacterAISetting>;
