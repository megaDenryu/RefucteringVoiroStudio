/**
 * webkitSpeechRecognitionの型定義ファイル。存在しなかったので作ったが問題あるかも。
 */

export interface SpeechRecognition {
    new (): SpeechRecognition;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    start(): void;
    stop(): void;
}

export interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

export const webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
} = (window as any).webkitSpeechRecognition;
