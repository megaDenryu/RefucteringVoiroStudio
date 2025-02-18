import { z } from "zod";
export const AppSettingsModel = z.object({
  コメント受信設定: z
    .object({
      ニコニコ生放送: z
        .object({
          配信URL: z
            .string()
            .describe("ニコ生の配信URLを入力してください")
            .default("test_niconico"),
          コメント受信: z
            .enum(["ON", "OFF"])
            .describe("コメント受信をONにするかOFFにするか選択してください")
            .default("OFF"),
          コメント禁止ワード: z
            .array(z.string())
            .describe("コメント禁止ワードを入力してください")
            .default(["4ね"]),
        })
        .optional(),
      YoutubeLive: z
        .object({
          配信URL: z
            .string()
            .describe("Youtubeの配信URLを入力してください")
            .default("test_youtube"),
        })
        .optional(),
      Twitch: z
        .object({
          配信URL: z
            .string()
            .describe("Twitch配信URLを入力してください")
            .default("test_twitch"),
        })
        .optional(),
    })
    .optional(),
  GPT設定: z
    .object({
      GPT起動状況: z
        .enum(["ON", "OFF"])
        .describe("GPT起動状況を入力してください")
        .default("OFF"),
    })
    .optional(),
  合成音声設定: z
    .object({
      COEIROINKv2設定: z
        .object({
          path: z
            .string()
            .describe("COEIROINKv2のパスを入力してください")
            .default(""),
        })
        .optional(),
    })
    .optional(),
  セリフ設定: z
    .object({
      AIによる文章変換の一括設定: z
        .enum(["無効", "ChatGPT"])
        .describe(
          "全てのキャラに対してAIによる文章変換を有効にするかどうかを一括設定できます。キャラ個別に設定したい場合はキャラクターのキャラ設定で行えます。",
        )
        .default("無効"),
      読み上げ間隔の一括設定: z
        .number()
        .gte(0)
        .lte(2)
        .describe(
          "全てのキャラに対して読み上げ間隔の秒数を一括設定できます。キャラ個別に設定したい場合はキャラクターのキャラ設定で行えます。",
        )
        .default(0),
    })
    .optional(),
});
export type AppSettingsModel = z.infer<typeof AppSettingsModel>;
