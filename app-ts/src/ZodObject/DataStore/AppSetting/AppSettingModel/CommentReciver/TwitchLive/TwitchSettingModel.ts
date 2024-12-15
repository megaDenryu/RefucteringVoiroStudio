import { z } from "zod";
export const TwitchSettingModel = z.object({
  配信URL: z
    .string()
    .describe("Twitch配信URLを入力してください")
    .default("test_twitch"),
});
export type TwitchSettingModel = z.infer<typeof TwitchSettingModel>;
