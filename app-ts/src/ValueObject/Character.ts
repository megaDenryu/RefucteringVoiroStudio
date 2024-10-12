export type TTSSoftware = "CevioAI" | "VoiceVox" | "AIVoice" | "Coeiroink";

export class TTSSoftwareEnum {
    static readonly CevioAI: TTSSoftware = "CevioAI";
    static readonly VoiceVox: TTSSoftware = "VoiceVox";
    static readonly AIVoice: TTSSoftware = "AIVoice";
    static readonly Coeiroink: TTSSoftware = "Coeiroink";

    static check(value: any): TTSSoftware {
        if (value === TTSSoftwareEnum.CevioAI) return "CevioAI";
        if (value === TTSSoftwareEnum.VoiceVox) return "VoiceVox";
        if (value === TTSSoftwareEnum.AIVoice) return "AIVoice";
        if (value === TTSSoftwareEnum.Coeiroink) return "Coeiroink";
        throw new Error("Invalid TTSSoftware");
    }

    static get values(): TTSSoftware[] {
        return [
            TTSSoftwareEnum.CevioAI,
            TTSSoftwareEnum.VoiceVox,
            TTSSoftwareEnum.AIVoice,
            TTSSoftwareEnum.Coeiroink
        ];
    }
}

export class CharacterName {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class NickName {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class VoiceMode {
    mode: string;
    id: number | null;
    id_str: string | null;

    constructor(mode: string, id: number | null = null, id_str: string | null = null) {
        this.mode = mode;
        this.id = id;
        this.id_str = id_str;
    }
}

export class HumanImage {
    folder_name: string;

    constructor(folder_name: string) {
        this.folder_name = folder_name;
    }
}