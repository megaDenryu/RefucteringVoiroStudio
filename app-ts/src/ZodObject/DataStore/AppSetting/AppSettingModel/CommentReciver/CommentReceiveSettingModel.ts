import { z } from "zod";
export const CommentReceiveSettingModel = z.object({
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
});
export type CommentReceiveSettingModel = z.infer<
  typeof CommentReceiveSettingModel
>;
