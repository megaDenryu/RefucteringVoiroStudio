import { EnumAbstract } from "./EnumAbstract";

// Emotion Enumを定義
export const emotionCandidates = ["悲しい", "嬉しい", "怒り"] as const;

export class EmotionEnum implements EnumAbstract<typeof emotionCandidates> {
    readonly candidate = emotionCandidates;
    readonly Type = null as any as typeof emotionCandidates[number];
}