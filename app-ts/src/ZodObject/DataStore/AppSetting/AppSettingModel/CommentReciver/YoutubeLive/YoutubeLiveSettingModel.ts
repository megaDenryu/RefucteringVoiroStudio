import { z } from "zod";
export const YoutubeLiveSettingModel = z.object({
  配信URL: z
    .string()
    .describe("Youtubeの配信URLを入力してください")
    .default("test_youtube"),
});
export type YoutubeLiveSettingModel = z.infer<typeof YoutubeLiveSettingModel>;
