import { z } from "zod";

export const GptMode = z.enum(["off", "individual_process0501dev"]);
export const GPTModeReq = z.object({
  characterId: z.string(),
  gptMode: GptMode,
  clientId: z.string(),
});
export type GptMode = z.infer<typeof GptMode>;
export type GPTModeReq = z.infer<typeof GPTModeReq>;
