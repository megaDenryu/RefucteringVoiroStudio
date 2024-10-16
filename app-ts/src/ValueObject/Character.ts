import { BaseValueObject, IValueObject } from "../BaseClasses/base_value_object";

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

export class CharacterName extends BaseValueObject{
    public readonly name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}

export class NickName extends BaseValueObject {
    public readonly name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}

export class VoiceMode extends BaseValueObject {
    public readonly mode: string;
    public readonly id: number | null;
    public readonly id_str: string | null;

    constructor(mode: string, id: number | null = null, id_str: string | null = null) {
        super();
        this.mode = mode;
        this.id = id;
        this.id_str = id_str;
    }
}

export class HumanImage extends BaseValueObject {
    public readonly folder_name: string;

    constructor(folder_name: string) {
        super();
        this.folder_name = folder_name;
    }
}

export class SelectCharacterState implements IValueObject<SelectCharacterState> {
    
    public readonly tts_software: TTSSoftware;
    public readonly character_name: CharacterName;
    public readonly human_image: HumanImage;
    public readonly voice_mode: VoiceMode;

    constructor(
        tts_software: TTSSoftware,
        character_name: CharacterName, 
        human_image: HumanImage,
        voice_mode: VoiceMode
    ) {
        this.character_name = character_name;
        this.voice_mode = voice_mode;
        this.human_image = human_image;
        this.tts_software = tts_software;
    }

    equals(other: SelectCharacterState): boolean {
        if (this.tts_software !== other.tts_software) return false;
        if (this.character_name.equals(other.character_name) === false) return false;
        if (this.human_image.equals(other.human_image) === false) return false;
        if (this.voice_mode.equals(other.voice_mode) === false) return false;
        return true;
    }

    includes(others: SelectCharacterState[]): boolean {
        for (const other of others) {
            if (this.equals(other) === true) return true;
        }
        return false;
    }
}

export class HumanNameState {
    public readonly character_name: CharacterName;
    public readonly nick_name: NickName;
    public readonly voice_mode: VoiceMode;
    public readonly human_image: HumanImage;

    constructor(character_name: CharacterName, nick_name: NickName, voice_mode: VoiceMode, human_image: HumanImage) {
        this.character_name = character_name;
        this.nick_name = nick_name;
        this.voice_mode = voice_mode;
        this.human_image = human_image;
    }

    equals(other: HumanNameState): boolean {
        if (this.character_name.equals(other.character_name) === false) return false;
        if (this.nick_name.equals(other.nick_name) === false) return false;
        if (this.voice_mode.equals(other.voice_mode) === false) return false;
        if (this.human_image.equals(other.human_image) === false) return false;
        return true;
    }

    includes(others: HumanNameState[]): boolean {
        for (const other of others) {
            if (this.equals(other) === true) return true;
        }
        return false;
    }
}