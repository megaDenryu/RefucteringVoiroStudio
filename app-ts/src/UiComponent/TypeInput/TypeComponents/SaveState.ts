import { z } from "zod";

export const SaveState = z.enum(["未保存", "保存済み"]);
export type SaveState = z.infer<typeof SaveState>;