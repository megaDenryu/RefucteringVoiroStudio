import { z } from "zod";
export const NiconicoLiveSettingModel = z.object({
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
});
export type NiconicoLiveSettingModel = z.infer<typeof NiconicoLiveSettingModel>;
