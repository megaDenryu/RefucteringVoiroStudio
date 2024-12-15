import { z } from "zod";
export const YoutubeLiveSettingModel = z.object({ 配信URL: z.string() });
export type YoutubeLiveSettingModel = z.infer<typeof YoutubeLiveSettingModel>;
