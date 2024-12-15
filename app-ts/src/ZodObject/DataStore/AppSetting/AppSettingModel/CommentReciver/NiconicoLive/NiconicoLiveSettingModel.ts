import { z } from "zod";
export const NiconicoLiveSettingModel = z.object({ 配信URL: z.string() });
export type NiconicoLiveSettingModel = z.infer<typeof NiconicoLiveSettingModel>;
