import { z } from "zod";
export const TwitchSettingModel = z.object({ 配信URL: z.string() });
export type TwitchSettingModel = z.infer<typeof TwitchSettingModel>;
