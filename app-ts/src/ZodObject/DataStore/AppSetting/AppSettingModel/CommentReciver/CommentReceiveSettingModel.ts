import { z } from "zod";
export const CommentReceiveSettingModel = z.object({
  ニコニコ生放送: z
    .object({
      配信URL: z
        .string()
        .describe("ニコ生の配信URLを入力してください")
        .default("test_niconico"),
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
