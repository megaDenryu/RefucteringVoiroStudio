import { z } from "zod";
export const CommentReceiveSettingModel = z.object({
  ニコニコ生放送: z.object({ 配信URL: z.string() }),
  YoutubeLive: z.object({ 配信URL: z.string() }),
  Twitch: z.object({ 配信URL: z.string() }),
});
export type CommentReceiveSettingModel = z.infer<
  typeof CommentReceiveSettingModel
>;
