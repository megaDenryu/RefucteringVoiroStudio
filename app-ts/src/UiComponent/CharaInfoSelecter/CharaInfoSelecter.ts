import { ReactiveProperty } from "../../BaseClasses/observer";
import { BaseComponent, ElementCreater, IHasComponent } from "../Base/ui_component_base";
import { CharacterName, HumanImage, HumanNameState, SelectCharacterState, TTSSoftware, TTSSoftwareEnum, VoiceMode } from "../../ValueObject/Character";



export class TTSSoftwareSelecter implements IHasComponent {
    public readonly component: BaseComponent;
    private readonly _selectedSoftware = new ReactiveProperty<TTSSoftware>;
    public get selectedSoftware(): TTSSoftware { return this._selectedSoftware.get(); }

    constructor() {
        this._selectedSoftware.set(TTSSoftwareEnum.CevioAI);
        const selectElement = ElementCreater.createSelectElement(TTSSoftwareEnum.values, this.calcBoxSize());
        selectElement.addEventListener('change', (event) => {
            this._selectedSoftware.set(TTSSoftwareEnum.check((event.target as HTMLSelectElement).value));
        });
        this.component = new BaseComponent(selectElement);
    }

    addOnSelectedSoftwareChanged(method: (ttsSoftware: TTSSoftware) => void): void {
        this._selectedSoftware.addMethod(method);
    }

    calcBoxSize(): number {
        return Object.values(TTSSoftwareEnum).length;
    }
}

export class CharacterNameSelecter implements IHasComponent {
    public readonly component: BaseComponent;
    public readonly ttsSoftware: TTSSoftware;
    private readonly characterNames: CharacterName[];
    private readonly selectedCharacterName = new ReactiveProperty<CharacterName>(null);

    constructor(ttsSoftware: TTSSoftware, characterNames: CharacterName[]) {
        this.ttsSoftware = ttsSoftware;
        this.characterNames = characterNames;
        const HTMLElementInput = ElementCreater.createSelectElement(characterNames.map(characterName => characterName.name), this.calcBoxSize());
        HTMLElementInput.addEventListener('change', (event) => {
            this.selectedCharacterName.set(new CharacterName((event.target as HTMLSelectElement).value));
            console.log(this.selectedCharacterName);
        });
        this.component = new BaseComponent(HTMLElementInput);
    }

    public addOnCharacterNameChanged(method: (characterName: CharacterName) => void): void {
        this.selectedCharacterName.addMethod(method);
    }

    private calcBoxSize(): number {
        return 8;
    }

    public show(): void {
        this.component.show();
    }

    public hide(): void {
        this.component.hide();
    }
}

export class CompositeCharacterNameSelecter implements IHasComponent {
    public readonly component: BaseComponent;
    private readonly characterNamesDict: Record<TTSSoftware, CharacterName[]>;
    private readonly characterNameSelecterDict: Record<TTSSoftware, CharacterNameSelecter>;
    private readonly _selectedSoftware:ReactiveProperty<TTSSoftware>;
    public get selectedSoftware(): CharacterName { return this._selectedCharacterName.get(); }
    private readonly _selectedCharacterName:ReactiveProperty<CharacterName>;
    public get selectedCharacterName(): CharacterName { return this._selectedCharacterName.get(); }

    get HTMLInput(): string {
        return `
        <div class="CompositeCharacterNameSelecter"></div>
        `;
    }

    constructor(characterNamesDict: Record<TTSSoftware, CharacterName[]>, defaultTTSSoftWare: TTSSoftware, defaultCharacterName: CharacterName) {
        this.component = new BaseComponent(this.HTMLInput);
        this.characterNamesDict = characterNamesDict;
        this.characterNameSelecterDict = {
            "AIVoice": new CharacterNameSelecter(TTSSoftwareEnum.AIVoice, characterNamesDict[TTSSoftwareEnum.AIVoice]),
            "CevioAI": new CharacterNameSelecter(TTSSoftwareEnum.CevioAI, characterNamesDict[TTSSoftwareEnum.CevioAI]),
            "VoiceVox": new CharacterNameSelecter(TTSSoftwareEnum.VoiceVox, characterNamesDict[TTSSoftwareEnum.VoiceVox]),
            "Coeiroink": new CharacterNameSelecter(TTSSoftwareEnum.Coeiroink, characterNamesDict[TTSSoftwareEnum.Coeiroink]),
        };
        this._selectedSoftware = new ReactiveProperty<TTSSoftware>(defaultTTSSoftWare);
        this._selectedCharacterName = new ReactiveProperty<CharacterName>(defaultCharacterName);
        this.delegateThisMethod();
        this._selectedSoftware.addMethod(this.changeCharacterNameSelecter.bind(this));
    }

    setGraph(): void {
        this.component.createArrowBetweenComponents(this, this.characterNameSelecterDict[TTSSoftwareEnum.AIVoice]);
        this.component.createArrowBetweenComponents(this, this.characterNameSelecterDict[TTSSoftwareEnum.CevioAI]);
        this.component.createArrowBetweenComponents(this, this.characterNameSelecterDict[TTSSoftwareEnum.VoiceVox]);
        this.component.createArrowBetweenComponents(this, this.characterNameSelecterDict[TTSSoftwareEnum.Coeiroink]);
    }

    changeCharacterNameSelecter(ttsSoftware: TTSSoftware): void {
        for (const [software, characterNameSelecter] of Object.entries(this.characterNameSelecterDict)) {
            if (software === ttsSoftware) {
                characterNameSelecter.show();
            } else {
                characterNameSelecter.hide();
            }
        }
    }

    delegateThisMethod(): void {
        // キャラセレクターの選択が変更されたときに、選択されたキャラクター名を変更する
        this.characterNameSelecterDict[TTSSoftwareEnum.AIVoice].addOnCharacterNameChanged(this._selectedCharacterName.set);
        this.characterNameSelecterDict[TTSSoftwareEnum.CevioAI].addOnCharacterNameChanged(this._selectedCharacterName.set);
        this.characterNameSelecterDict[TTSSoftwareEnum.VoiceVox].addOnCharacterNameChanged(this._selectedCharacterName.set);
        this.characterNameSelecterDict[TTSSoftwareEnum.Coeiroink].addOnCharacterNameChanged(this._selectedCharacterName.set);
    }

    addOnCharacterNameChanged(method: (characterName: CharacterName) => void): void {
        this._selectedCharacterName.addMethod(method);
    }
}

export class HumanImageSelecter implements IHasComponent {
    //人間の画像が選択されたときは何を実行するんだ？決定ボタンを表示する？そもそもダブルクリックでもいいのでは？特にイベントは今のところ考えていない

    public readonly component: BaseComponent;
    private readonly _humanImages: HumanImage[];
    private readonly _selectedHumanImage: ReactiveProperty<HumanImage>;

    constructor(humanImages: HumanImage[], defaultHumanImage: HumanImage = humanImages[0]??null) {
        this._humanImages = humanImages;
        this._selectedHumanImage = new ReactiveProperty<HumanImage>(defaultHumanImage);
        const HTMLElementInput = ElementCreater.createSelectElement(humanImages.map(humanImage => humanImage.folder_name), this.calcBoxSize());
        HTMLElementInput.addEventListener('change', (event) => {
            this._selectedHumanImage.set(new HumanImage((event.target as HTMLSelectElement).value));
        });
        this.component = new BaseComponent(HTMLElementInput);
    }

    private calcBoxSize(): number {
        return 8;
    }

    public addOnHumanImageChanged(method: (humanImage: HumanImage) => void): void {
        this._selectedHumanImage.addMethod(method);
    }

    public show(): void {
        this.component.show();
    }

    public hide(): void {
        this.component.hide();
    }

}

export class CompositeHumanImageSelecter implements IHasComponent {
    public readonly component: BaseComponent;
    private readonly humanImagesDict: Map<CharacterName, HumanImage[]>;
    private readonly humanImageSelecterDict: Map<CharacterName, HumanImageSelecter>;
    //変化したときに表示するセレクターを変える
    selectedCharacterName: ReactiveProperty<CharacterName>;
    private _selectedHumanImage: HumanImage;
    public get selectedHumanImage(): HumanImage { return this._selectedHumanImage; }

    constructor(humanImagesDict: Map<CharacterName, HumanImage[]>, defaultCharacterName: CharacterName, defaultHumanImage: HumanImage) {
        this.component = new BaseComponent(this.HTMLInput);
        this.humanImagesDict = humanImagesDict;
        this.selectedCharacterName = new ReactiveProperty<CharacterName>(defaultCharacterName);
        this._selectedHumanImage = defaultHumanImage;
        this.humanImageSelecterDict = this.createHumanImageSelecter(humanImagesDict);
        this.start();
    }

    private start(): void {
        this.selectedCharacterName.addMethod(this.changeShowHumanImageSelecter.bind(this));
        this.setGraph();
    }

    private get HTMLInput(): string {
        return `
        <div class="CompositeHumanImageSelecter"></div>
        `;
    }

    private createHumanImageSelecter(humanImagesDict: Map<CharacterName, HumanImage[]>): Map<CharacterName, HumanImageSelecter> {
        const humanImageSelecter: Map<CharacterName, HumanImageSelecter> = new Map();
        for (const [characterName, humanImages] of humanImagesDict.entries()) {
            humanImageSelecter.set(characterName, new HumanImageSelecter(humanImages));
        }
        
        return humanImageSelecter;
    }

    private setGraph(): void {
        for (const [characterName, humanImageSelecter] of Object.entries(this.humanImageSelecterDict)) {
            this.component.createArrowBetweenComponents(this, humanImageSelecter);
            humanImageSelecter.addOnHumanImageChanged((humanImage) => {this._selectedHumanImage = humanImage;});

        }
    }

    changeShowHumanImageSelecter(characterName: CharacterName): void {
        for (const [name, humanImageSelecter] of Object.entries(this.humanImageSelecterDict)) {
            if (name === characterName.name) {
                humanImageSelecter.show();
            } else {
                humanImageSelecter.hide();
            }
        }
    }
}

export class VoicemodeSelecter implements IHasComponent {
    /**
     * 音声モードを選択するセレクター
     * アクション１：一つのキャラクターの音声モードを選択するとコンポジットボイスモードセレクターに送られて、音声モードが変更される
     * アクション２：キャラクターが変更されるとこのセレクターが表示されたり消えたりする
     * 
     */
    public readonly component: BaseComponent;
    public readonly characterName: CharacterName;
    private readonly _VoiceModes: VoiceMode[];
    private readonly _selectedVoiceMode: ReactiveProperty<VoiceMode>;
    public get selectedVoiceMode(): VoiceMode { return this._selectedVoiceMode.get(); }

    constructor(characterName: CharacterName, VoiceModes: VoiceMode[], defaultVoiceMode: VoiceMode = VoiceModes[0]??null) {
        this.characterName = characterName;
        this._selectedVoiceMode = new ReactiveProperty<VoiceMode>(defaultVoiceMode);
        const HTMLElementInput = ElementCreater.createSelectElement(VoiceModes.map(VoiceMode => VoiceMode.mode), this.calcBoxSize());
        HTMLElementInput.addEventListener('change', (event) => {
            this._selectedVoiceMode.set(new VoiceMode((event.target as HTMLSelectElement).value));
        });
        this.component = new BaseComponent(HTMLElementInput);
    }

    private calcBoxSize(): number {
        return 5;
    }

    public addOnVoiceModeChanged(method: (voiceMode: VoiceMode) => void): void {
        this._selectedVoiceMode.addMethod(method);
    }

    public show(): void {
        this.component.show();
    }

    public hide(): void {
        this.component.hide();
    }
}

export class CompositeVoiceModeSelecter implements IHasComponent {
    component: BaseComponent;
    public selectedCharacterName: ReactiveProperty<CharacterName>;
    private _selectedVoiceMode: VoiceMode;
    private voiceModesDict: Map<CharacterName, VoiceMode[]>;
    private voiceModeSelecterDict: Map<CharacterName, VoicemodeSelecter>;

    get selectedVoiceMode(): VoiceMode { return this._selectedVoiceMode; }
    get HTMLInput(): string {
        return `
        <div class="CompositeVoiceModeSelecter"></div>
        `;
    }

    constructor(cvoiceModesDict: Map<CharacterName, VoiceMode[]>, defaultCharacterName: CharacterName, defaultVoiceMode: VoiceMode) {
        this.component = new BaseComponent(this.HTMLInput);
        this.selectedCharacterName = new ReactiveProperty<CharacterName>(defaultCharacterName);
        this._selectedVoiceMode = defaultVoiceMode;
        this.voiceModesDict = cvoiceModesDict;
        this.voiceModeSelecterDict = this.createVoiceModeSelecter(cvoiceModesDict);
        this.start();
    }
    
    private start(): void {
        this.setGraph();
        this.selectedCharacterName.addMethod(this.changeShowVoiceModeSelecter.bind(this));
        this.changeShowVoiceModeSelecter(this.selectedCharacterName.get());
    }

    private createVoiceModeSelecter(voiceModesDict: Map<CharacterName, VoiceMode[]>): Map<CharacterName, VoicemodeSelecter> {
        const voiceModeSelecter: Map<CharacterName, VoicemodeSelecter> = new Map();
        for (const [characterName, voiceModes] of voiceModesDict.entries()) {
            voiceModeSelecter.set(characterName, new VoicemodeSelecter(characterName, voiceModes));
        }
        return voiceModeSelecter;
    }

    setGraph(): void {
        for (const [characterName, voiceModeSelecter] of this.voiceModeSelecterDict.entries()) {
            this.component.createArrowBetweenComponents(this, voiceModeSelecter);
            voiceModeSelecter.addOnVoiceModeChanged((voiceMode) => {this._selectedVoiceMode = voiceMode;});
        }
    }

    changeShowVoiceModeSelecter(characterName: CharacterName): void {
        for (const [name, voiceModeSelecter] of this.voiceModeSelecterDict.entries()) {
            if (name === characterName) {
                voiceModeSelecter.show();
            } else {
                voiceModeSelecter.hide();
            }
        }
    }

}

export class CharacterSelectDecisionButton implements IHasComponent {
    /**キャラクターを決定するために押すボタン
     * 押すとapiサーバーにリクエストを投げる
     * 
     * 必要な物
     * 1. buttonの見た目要素
     * 2. キャラクターが決定されたときのメソッドを持つ
     * 
     **/

    component: BaseComponent;
    onPushButton = new ReactiveProperty<boolean>(false);

    constructor() {
        const button = ElementCreater.createButtonElement("決定",() => {
            this.onPushButton.set(true);
        });
        this.component = new BaseComponent(button);
    }

    addOnPushButton(method: () => void): void {
        this.onPushButton.addMethod(method);
    }
}

export class CharaSelectFunction implements IHasComponent {
    private characterNamesDict: Record<TTSSoftware, CharacterName[]>
    private humanImagesDict: Map<CharacterName, HumanImage[]>;
    private voiceModesDict: Map<CharacterName, VoiceMode[]>;
    public readonly component: BaseComponent;
    private ttsSoftwareSelecter: TTSSoftwareSelecter;
    private compositeCharacterNameSelecter: CompositeCharacterNameSelecter;
    private compositehumanImageSelecter: CompositeHumanImageSelecter;
    private compositeVoiceModeSelecter: CompositeVoiceModeSelecter;
    private characterSelectDecisionButton: CharacterSelectDecisionButton;

    get defaultTTSSoftWare(): TTSSoftware {
        //defaultCharacterNameが選択されているTTSSoftwareを返す
        for (const [ttsSoftware, characterName] of Object.entries(this.characterNamesDict)) {
            if (characterName.includes(this.defaultCharacterName)) {
                return ttsSoftware as TTSSoftware;
            }
        }
        throw new Error("No TTSSoftware");
    }

    get defaultCharacterName(): CharacterName {
        //defaultHumanImageが選択されているCharacterNameを返す
        for (const [characterName, humanImage] of this.humanImagesDict.entries()) {
            if (humanImage.includes(this.defaultHumanImage)) {
                return characterName;
            }
        }
        throw new Error("No CharacterName");
    }

    get defaultHumanImage(): HumanImage {
        //全てのHumanImageの中で要素が１つ以上あるものを返す

        for (const [characterName, humanImage] of this.humanImagesDict.entries()) {
            if (humanImage.length > 0) {
                return humanImage[0];
            }
        }
        throw new Error("No HumanImage");
    }

    get defaultVoiceMode(): VoiceMode {
        // defaultCharacterNameが選択されているVoiceModeを返す
        const t: VoiceMode[] | undefined = this.voiceModesDict.get(this.defaultCharacterName)
        if (t != null) {
            return t[0];
        }

        throw new Error("全てのキャラにボイスモードがあるはずなので、ここには来ないはず");
    }

    constructor(
        characterNamesDict: Record<TTSSoftware, CharacterName[]>, 
        humanImagesDict: Map<CharacterName, HumanImage[]>,
        voiceModesDict: Map<CharacterName, VoiceMode[]>
    ) {
        this.characterNamesDict = characterNamesDict;
        this.humanImagesDict = humanImagesDict;
        this.voiceModesDict = voiceModesDict;

        this.ttsSoftwareSelecter = new TTSSoftwareSelecter();
        this.compositeCharacterNameSelecter = new CompositeCharacterNameSelecter(characterNamesDict, this.defaultTTSSoftWare, this.defaultCharacterName);
        this.compositehumanImageSelecter = new CompositeHumanImageSelecter(humanImagesDict, this.defaultCharacterName, this.defaultHumanImage);
        this.compositeVoiceModeSelecter = new CompositeVoiceModeSelecter(voiceModesDict, this.defaultCharacterName, this.defaultVoiceMode);
        this.characterSelectDecisionButton = new CharacterSelectDecisionButton();
        this.component = new BaseComponent(this.componentDefString);
        this.start();
    }

    get componentDefString(): string {
        return `
        <div class="CharaSelectFunction">
            <div class="TTSSoftwareSelecter"></div>
            <div class="CharacterNameSelecter"></div>
            <div class="HumanImageSelecter"></div>
        </div>
        `;
    }

    start(): void {
        this.initSetChildElement();
    }

    initSetChildElement(): void {
        this.component.createArrowBetweenComponents(this, this.ttsSoftwareSelecter);
        this.component.createArrowBetweenComponents(this, this.compositeCharacterNameSelecter);
        this.component.createArrowBetweenComponents(this, this.compositehumanImageSelecter);
        this.component.createArrowBetweenComponents(this, this.compositeVoiceModeSelecter);
        this.component.createArrowBetweenComponents(this, this.characterSelectDecisionButton);
    }

    definitionBehavior(): void {
        this.ttsSoftwareSelecter.addOnSelectedSoftwareChanged(this.compositeCharacterNameSelecter.changeCharacterNameSelecter.bind(this.compositeCharacterNameSelecter));
        this.compositeCharacterNameSelecter.addOnCharacterNameChanged(this.compositehumanImageSelecter.changeShowHumanImageSelecter.bind(this.compositehumanImageSelecter));
    }

    decideCharacter(): void {
        //キャラクターが決定されたときの処理
        const selectState = new SelectCharacterState(
            this.ttsSoftwareSelecter.selectedSoftware, 
            this.compositeCharacterNameSelecter.selectedCharacterName, 
            this.compositehumanImageSelecter.selectedHumanImage,
            this.compositeVoiceModeSelecter.selectedVoiceMode
        );
        //情報をまとめてサーバーにPostでリクエストを投げる

        
        //サーバーから返ってきた情報を元に、キャラクターを生成する
        //送るapiエンドポイントの名前は
        
    }

    private fetchCharaInfo(): void {
        
    }
}