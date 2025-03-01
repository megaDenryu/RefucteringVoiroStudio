import { z } from "zod";
export const VoiceVoxCharacterSettingSaveModel = z.object({
  saveID: z.string().describe("保存IDを指定します。"),
  characterInfo: z.object({
    characterName: z.object({ name: z.string() }),
    nickName: z.object({ name: z.string() }),
    humanImage: z.object({ folder_name: z.string() }),
    aiSetting: z.object({
      名前: z.string(),
      年齢: z.number().int(),
      性別: z.string(),
      背景情報: z.string(),
      役割: z.string(),
      動機: z.string(),
      アリバイ: z.string(),
      性格特性: z.string(),
      関係: z.array(
        z.object({ 他のキャラクター名: z.string(), 関係: z.string() }),
      ),
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
    }),
  }),
  voiceSetting: z
    .object({
      スピード: z
        .number()
        .gte(0.5)
        .lte(2)
        .describe("読み上げ速度を調整します。")
        .default(1),
      ピッチ: z.number().gte(-0.15).lte(0.15).default(0),
      イントネーション: z.number().gte(0).lte(2).default(1),
      音量: z.number().gte(0).lte(2).default(1),
    })
    .describe("音声設定を指定します。")
    .optional(),
  readingAloud: z
    .object({
      AIによる文章変換: z.enum(["無効", "ChatGPT", "Gemini"]).default("無効"),
      読み上げ間隔: z.number().gte(0).lte(2).default(0),
    })
    .describe("読み上げ設定を指定します。")
    .optional(),
});
export type VoiceVoxCharacterSettingSaveModel = z.infer<
  typeof VoiceVoxCharacterSettingSaveModel
>;
