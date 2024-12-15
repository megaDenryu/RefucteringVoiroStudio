import { z } from "zod";
export const NiconicoLiveSettingModel = z.object({
  配信URL: z
    .string()
    .describe("ニコ生の配信URLを入力してください")
    .default("test_niconico"),
});
export type NiconicoLiveSettingModel = z.infer<typeof NiconicoLiveSettingModel>;
