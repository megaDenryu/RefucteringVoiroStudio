import { z } from "zod";
export const GPTModeReq = z.object({
  characterId: z.string(),
  gptMode: z.enum(["off", "individual_process0501dev"]),
  clientId: z.string(),
});
export type GPTModeReq = z.infer<typeof GPTModeReq>;
