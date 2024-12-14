import { z } from "zod";
export const AppSettingModel = z.object({
  コメント受信設定: z.object({
    ニコニコ生放送: z.object({ 配信URL: z.string() }),
    YoutubeLive: z.object({ 配信URL: z.string() }),
    Twitch: z.object({ 配信URL: z.string() }),
  }),
});

