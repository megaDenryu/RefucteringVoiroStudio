import { BaseValueObject, IValueObject } from "../BaseClasses/base_value_object";
import { IAllHumanInformationDict, ICharacterName, IHumanImage, IHumanInformation, IHumanInformationList, IHumanNameState, INickName, ISelectCharacterState, IVoiceMode } from "../UiComponent/CharaInfoSelecter/ICharacterInfo";

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

    toDict(): ICharacterName {
        return {
            name: this.name
        };
    }

    static fromDict(characterName: ICharacterName): CharacterName {
        return new CharacterName(characterName.name);
    }
}

export class NickName extends BaseValueObject {
    public readonly name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    toDict(): INickName {
        return {
            name: this.name
        };
    }

    static fromDict(nickName: INickName): NickName {
        return new NickName(nickName.name);
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

    toDict(): IVoiceMode {
        return {
            mode: this.mode,
            id: this.id,
            id_str: this.id_str
        };
    }

    static fromDict(voiceMode: IVoiceMode): VoiceMode {
        return new VoiceMode(voiceMode.mode, voiceMode.id, voiceMode.id_str);
    }
}

export class HumanImage extends BaseValueObject {
    public readonly folder_name: string;

    constructor(folder_name: string) {
        super();
        this.folder_name = folder_name;
    }

    toDict(): IHumanImage {
        return {
            folder_name: this.folder_name
        };
    }

    static fromDict(humanImage: IHumanImage): HumanImage {
        return new HumanImage(humanImage.folder_name);
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

    toDict(): ISelectCharacterState {
        return {
            tts_software: this.tts_software,
            character_name: this.character_name.toDict(),
            human_image: this.human_image.toDict(),
            voice_mode: this.voice_mode.toDict()
        };
    }

    static fromDict(selectCharacterState: ISelectCharacterState): SelectCharacterState {
        return new SelectCharacterState(
            TTSSoftwareEnum.check(selectCharacterState.tts_software),
            CharacterName.fromDict(selectCharacterState.character_name),
            HumanImage.fromDict(selectCharacterState.human_image),
            VoiceMode.fromDict(selectCharacterState.voice_mode)
        );
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

    toDict(): IHumanNameState {
        return {
        };
    }
}


export class HumanInformation {
    chara_name: CharacterName;
    nicknames: NickName[];
    voice_modes: VoiceMode[];
    images: HumanImage[];

    constructor(humanInformation: IHumanInformation) {
        this.chara_name = new CharacterName(humanInformation.chara_name.name);
        this.nicknames = humanInformation.nicknames.map(nick_name => new NickName(nick_name.name));
        this.voice_modes = humanInformation.voice_modes.map(voice_mode => new VoiceMode(voice_mode.mode, voice_mode.id, voice_mode.id_str));
        this.images = humanInformation.images.map(image => new HumanImage(image.folder_name));
    }
}

export class HumanInformationList {
    tTSSoftware: TTSSoftware;
    human_informations: HumanInformation[];

    constructor(humanInformationList: IHumanInformationList) {
        this.tTSSoftware = TTSSoftwareEnum.check(humanInformationList.tTSSoftware);
        this.human_informations = humanInformationList.human_informations.map(humanInformation => new HumanInformation(humanInformation));
    }
}

export class AllHumanInformationDict {
    data: Record<TTSSoftware, HumanInformationList>;

    constructor(allHumanInformationDict: IAllHumanInformationDict) {
        this.data = {
            CevioAI: new HumanInformationList(allHumanInformationDict.data.CevioAI),
            VoiceVox: new HumanInformationList(allHumanInformationDict.data.VoiceVox),
            AIVoice: new HumanInformationList(allHumanInformationDict.data.AIVoice),
            Coeiroink: new HumanInformationList(allHumanInformationDict.data.Coeiroink)
        };
    }

    public getCharacterNamesDict(): Record<TTSSoftware, CharacterName[]> {
        const characterNamesDict: Record<TTSSoftware, CharacterName[]> = {
            CevioAI: [],
            VoiceVox: [],
            AIVoice: [],
            Coeiroink: []
        };
        for (const ttsSoftware of TTSSoftwareEnum.values) {
            this.data[ttsSoftware].human_informations.forEach(humanInformation => {
                characterNamesDict[ttsSoftware].push(humanInformation.chara_name);
            });
        }
        return characterNamesDict;
    }

    public getHumanImagesDict(): Map<CharacterName, HumanImage[]> {
        const humanImagesDict = new Map<CharacterName, HumanImage[]>();
        for (const ttsSoftware of TTSSoftwareEnum.values) {
            this.data[ttsSoftware].human_informations.forEach(humanInformation => {
                humanImagesDict.set(humanInformation.chara_name, humanInformation.images);
            });
        }
        return humanImagesDict;
    }

    public getVoiceModesDict(): Map<CharacterName, VoiceMode[]> {
        const voiceModesDict = new Map<CharacterName, VoiceMode[]>();
        for (const ttsSoftware of TTSSoftwareEnum.values) {
            this.data[ttsSoftware].human_informations.forEach(humanInformation => {
                voiceModesDict.set(humanInformation.chara_name, humanInformation.voice_modes);
            });
        }
        return voiceModesDict;
    }
}
