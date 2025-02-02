import { z } from "zod";
export const HumanImage = z.object({ folder_name: z.string() });
export type HumanImage = z.infer<typeof HumanImage>;
