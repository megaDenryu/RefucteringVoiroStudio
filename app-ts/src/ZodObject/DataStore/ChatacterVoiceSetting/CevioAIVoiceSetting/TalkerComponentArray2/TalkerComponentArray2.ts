import { z } from "zod";
export const TalkerComponentArray2 = z.object({
  record: z.record(z.number().int()).default({}),
});
export type TalkerComponentArray2 = z.infer<typeof TalkerComponentArray2>;
