import { ReactiveProperty } from "../../BaseClasses/observer";
import { BaseComponent, ElementChildClass, ElementCreater, HtmlElementInput, IHasComponent } from "../Base/ui_component_base";
import { CharacterName, HumanImage, CharacterModeState, TTSSoftware, TTSSoftwareEnum, VoiceMode } from "../../ValueObject/Character";
import { RequestAPI } from "../../Web/RequestApi";
import { HumanTab } from "../HumanDisplay/HumanWindow";
import { CharaCreateData, HumanData } from "../../ValueObject/IHumanPart";
import { ZIndexManager } from "../../AppPage/AppVoiroStudio/ZIndexManager";
import { DragMover, IDragAble } from "../Base/DragableComponent";
import { VoiceState } from "../../ValueObject/VoiceState";



export class TTSSoftwareSelecter implements IHasComponent {
    public readonly component: BaseComponent;
    private readonly _selectedSoftware:ReactiveProperty<TTSSoftware>;
    public get selectedSoftware(): TTSSoftware { return this._selectedSoftware.get(); }

    constructor(defaultTTSSoftware: TTSSoftware) {
        this._selectedSoftware = new ReactiveProperty<TTSSoftware>(defaultTTSSoftware);
        const selectElement = ElementCreater.createSelectElement(TTSSoftwareEnum.values, this.calcBoxSize());
        selectElement.addEventListener('change', (event) => {
            this._selectedSoftware.set(TTSSoftwareEnum.check((event.target as HTMLSelectElement).value));
        });
        this.component = new BaseComponent(selectElement);
        this.component.addCSSClass("TTSSoftwareSelecter");
        this.start();
    }

    addOnSelectedSoftwareChanged(method: (ttsSoftware: TTSSoftware) => void): void {
        this._selectedSoftware.addMethod(method);
    }

    calcBoxSize(): number {
        return Object.values(TTSSoftwareEnum).length;
    }

    start(): void {
        this.addOnSelectedSoftwareChanged((ttsSoftware) => {
            this.defineBehavior(ttsSoftware);
        });
        this._selectedSoftware.set(this.selectedSoftware);
    }

    defineBehavior(ttsSoftware: TTSSoftware): void {
        this.changeTTSSoftwareCssClas(ttsSoftware); //cevioが選択されたらcevioのcssクラスを追加して他のTTSソフトのcssクラスを削除する

    }

    changeTTSSoftwareCssClas(ttsSoftware: TTSSoftware): void {
        this.component.addCSSClass(ttsSoftware);
        const remove_list = Object.values(TTSSoftwareEnum).filter((software) => software !== ttsSoftware);
        for (const software of remove_list) {
            this.component.removeCSSClass(software);
        }

    }
}

export class CharacterNameSelecter implements IHasComponent {
    public readonly component: BaseComponent;
    public readonly ttsSoftware: TTSSoftware;
    private readonly characterNames: CharacterName[];
    private readonly selectedCharacterName:ReactiveProperty<CharacterName>;

    constructor(ttsSoftware: TTSSoftware, characterNames: CharacterName[]) {
        this.ttsSoftware = ttsSoftware;
        this.characterNames = characterNames;
        this.selectedCharacterName = new ReactiveProperty<CharacterName>(characterNames[0]);
        const characterNameList: string[] = characterNames.map(characterName => characterName.name);
        const HTMLElementInput = ElementCreater.createSelectElement(characterNameList, this.calcBoxSize());
        HTMLElementInput.addEventListener('change', (event) => {
            this.selectedCharacterName.set(new CharacterName((event.target as HTMLSelectElement).value));
        });
        this.component = new BaseComponent(HTMLElementInput);
        this.component.addCSSClass(["CharacterNameSelecter", "SelecterSize"]);
    }

    public addOnCharacterNameChanged(method: (characterName: CharacterName) => void): void {
        this.selectedCharacterName.addMethod(method);
    }

    private calcBoxSize(): number {
        return 8;
    }

    public show(): void {
        this.component.show();
        this.selectedCharacterName.set(this.selectedCharacterName.get());
    }

    public hide(): void {
        this.component.hide();
    }
}

export class CompositeCharacterNameSelecter implements IHasComponent {
    public readonly component: BaseComponent;
    private readonly characterNamesDict: Record<TTSSoftware, CharacterName[]>;
    private readonly characterNameSelecterDict: Record<TTSSoftware, CharacterNameSelecter>;
    public readonly selectedSoftware:ReactiveProperty<TTSSoftware>;
    private readonly _selectedCharacterName:ReactiveProperty<CharacterName>;
    public get selectedCharacterName(): CharacterName { return this._selectedCharacterName.get(); }

    private get HTMLInput(): string {
        return `
        <div class="CompositeCharacterNameSelecter"></div>
        `;
    }

    constructor(characterNamesDict: Record<TTSSoftware, CharacterName[]>, defaultTTSSoftWare: TTSSoftware, defaultCharacterName: CharacterName) {
        this.component = BaseComponent.createElementByString(this.HTMLInput);
        this.characterNamesDict = characterNamesDict;
        this.characterNameSelecterDict = {
            "AIVoice": new CharacterNameSelecter(TTSSoftwareEnum.AIVoice, characterNamesDict[TTSSoftwareEnum.AIVoice]),
            "CevioAI": new CharacterNameSelecter(TTSSoftwareEnum.CevioAI, characterNamesDict[TTSSoftwareEnum.CevioAI]),
            "VoiceVox": new CharacterNameSelecter(TTSSoftwareEnum.VoiceVox, characterNamesDict[TTSSoftwareEnum.VoiceVox]),
            "Coeiroink": new CharacterNameSelecter(TTSSoftwareEnum.Coeiroink, characterNamesDict[TTSSoftwareEnum.Coeiroink]),
        };
        this.selectedSoftware = new ReactiveProperty<TTSSoftware>(defaultTTSSoftWare);
        this._selectedCharacterName = new ReactiveProperty<CharacterName>(defaultCharacterName);
        this.start();
    }

    start(): void {
        this.setGraph();
        this.delegateThisMethod();
        this.selectedSoftware.addMethod((ttsSoftware) => {
            this.changeCharacterNameSelecter(ttsSoftware);
        });
        this.selectedSoftware.set(this.selectedSoftware.get());
        this._selectedCharacterName.set(this.selectedCharacterName);
        this.component.addCSSClass(["CompositeCharacterNameSelecter","CompositeSelecterSize"]);
    }

    private setGraph(): void {
        this.component.createArrowBetweenComponents(this, this.characterNameSelecterDict[TTSSoftwareEnum.AIVoice]);
        this.component.createArrowBetweenComponents(this, this.characterNameSelecterDict[TTSSoftwareEnum.CevioAI]);
        this.component.createArrowBetweenComponents(this, this.characterNameSelecterDict[TTSSoftwareEnum.VoiceVox]);
        this.component.createArrowBetweenComponents(this, this.characterNameSelecterDict[TTSSoftwareEnum.Coeiroink]);
    }

    private changeCharacterNameSelecter(ttsSoftware: TTSSoftware): void {
        for (const [software, characterNameSelecter] of Object.entries(this.characterNameSelecterDict)) {
            if (software === ttsSoftware) {
                characterNameSelecter.show();
            } else {
                characterNameSelecter.hide();
            }
        }
    }

    private delegateThisMethod(): void {
        // キャラセレクターの選択が変更されたときに、選択されたキャラクター名を変更する
        this.characterNameSelecterDict[TTSSoftwareEnum.AIVoice].addOnCharacterNameChanged((characterName) => {this._selectedCharacterName.set(characterName);});
        this.characterNameSelecterDict[TTSSoftwareEnum.CevioAI].addOnCharacterNameChanged((characterName) => {this._selectedCharacterName.set(characterName);});
        this.characterNameSelecterDict[TTSSoftwareEnum.VoiceVox].addOnCharacterNameChanged((characterName) => {this._selectedCharacterName.set(characterName);});
        this.characterNameSelecterDict[TTSSoftwareEnum.Coeiroink].addOnCharacterNameChanged((characterName) => {this._selectedCharacterName.set(characterName);});
    }

    public addOnCharacterNameChanged(method: (characterName: CharacterName) => void): void {
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
        this.component.addCSSClass(["HumanImageSelecter","SelecterSize"]);
    }

    private calcBoxSize(): number {
        return 8;
    }

    public addOnHumanImageChanged(method: (humanImage: HumanImage) => void): void {
        this._selectedHumanImage.addMethod(method);
    }

    public show(): void {
        this.component.show();
        this._selectedHumanImage.set(this._selectedHumanImage.get());
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
    public readonly selectedCharacterName: ReactiveProperty<CharacterName>;
    private _selectedHumanImage: HumanImage;
    public get selectedHumanImage(): HumanImage { return this._selectedHumanImage; }

    constructor(humanImagesDict: Map<CharacterName, HumanImage[]>, defaultCharacterName: CharacterName, defaultHumanImage: HumanImage) {
        this.component = BaseComponent.createElementByString(this.HTMLInput);
        this.humanImagesDict = humanImagesDict;
        this.selectedCharacterName = new ReactiveProperty<CharacterName>(defaultCharacterName);
        this._selectedHumanImage = defaultHumanImage;
        this.humanImageSelecterDict = this.createHumanImageSelecter(humanImagesDict);
        this.start();
    }

    private start(): void {
        this.selectedCharacterName.addMethod((CharacterName) => {
            this.changeShowHumanImageSelecter(CharacterName);
        });
        this.setGraph();
        this.selectedCharacterName.set(this.selectedCharacterName.get());
        this.component.addCSSClass(["CompositeHumanImageSelecter","CompositeSelecterSize"]);
    }

    private get HTMLInput(): string {
        return `
        <div class="CompositeHumanImageSelecter"></div>
        `;
    }

    private createHumanImageSelecter(humanImagesDict: Map<CharacterName, HumanImage[]>): Map<CharacterName, HumanImageSelecter> {
        const humanImageSelecterMap: Map<CharacterName, HumanImageSelecter> = new Map();
        for (const [characterName, humanImages] of humanImagesDict.entries()) {
            const humanImageSelecter = new HumanImageSelecter(humanImages);
            humanImageSelecter.addOnHumanImageChanged((humanImage) => {this._selectedHumanImage = humanImage;});
            humanImageSelecterMap.set(characterName, humanImageSelecter);
        }
        
        return humanImageSelecterMap;
    }

    private setGraph(): void {
        for (const [characterName, humanImageSelecter] of this.humanImageSelecterDict.entries()) {
            this.component.createArrowBetweenComponents(this, humanImageSelecter);
            humanImageSelecter.addOnHumanImageChanged((humanImage) => {this._selectedHumanImage = humanImage;});
        }
    }

    changeShowHumanImageSelecter(characterName: CharacterName): void {
        for (const [name, humanImageSelecter] of this.humanImageSelecterDict.entries()) {
            if (name.equals(characterName)) {
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
     * 
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
        this.component.addCSSClass(["VoicemodeSelecter", "SelecterSize"]);
    }

    private calcBoxSize(): number {
        return 8;
    }

    public addOnVoiceModeChanged(method: (voiceMode: VoiceMode) => void): void {
        this._selectedVoiceMode.addMethod(method);
    }

    public show(): void {
        this.component.show();
        this._selectedVoiceMode.set(this._selectedVoiceMode.get());
    }

    public hide(): void {
        this.component.hide();
    }
}

export class CompositeVoiceModeSelecter implements IHasComponent {
    component: BaseComponent;
    public readonly selectedCharacterName: ReactiveProperty<CharacterName>;
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
        this.component = BaseComponent.createElementByString(this.HTMLInput);
        this.selectedCharacterName = new ReactiveProperty<CharacterName>(defaultCharacterName);
        this._selectedVoiceMode = defaultVoiceMode;
        this.voiceModesDict = cvoiceModesDict;
        this.voiceModeSelecterDict = this.createVoiceModeSelecter(cvoiceModesDict);
        this.start();
    }
    
    private start(): void {
        this.setGraph();
        this.selectedCharacterName.addMethod((charaName) => {
            this.changeShowVoiceModeSelecter(charaName);
        });
        this.selectedCharacterName.set(this.selectedCharacterName.get());
        this.component.addCSSClass(["CompositeVoiceModeSelecter","CompositeSelecterSize"]);
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
            if (name.equals(characterName)) {
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
        const button = ElementCreater.createButtonElement("▷決定▷",() => {
            this.onPushButton.set(true);
        });
        this.component = new BaseComponent(button);
        this.component.addCSSClass("CharacterSelectDecisionButton");
    }

    addOnPushButton(method: () => void): void {
        this.onPushButton.addMethod(method);
    }
}


export class CharaSelecterDeleteButton implements IHasComponent {
    component: BaseComponent;
    onPushButton = new ReactiveProperty<boolean>(false);

    constructor() {
        const button = ElementCreater.createButtonElement("◁閉じる◁",() => {
            this.onPushButton.set(true);
        });
        this.component = new BaseComponent(button);
        this.component.addCSSClass("CharaSelecterDeleteButton");
    }

    addOnPushButton(method: () => void): void {
        this.onPushButton.addMethod(method);
    }
}


export class CharaSelectFunction implements IHasComponent, IDragAble {
    private readonly Def = HtmlElementInput.new(
        `
            <div class="CharaSelectFunction">
                <div class="AriaTTSSoftwareSelecter"></div>
                <div class="AriaFlexCompositeCharaSelecters"></div>
                <div class="AriaButton"></div>
                <div class="AriaDeleteButton"></div>
            </div>
        `,
        {
            "AriaTTSSoftwareSelecter":"AriaTTSSoftwareSelecter",
            "AriaFlexCompositeCharaSelecters":"AriaFlexCompositeCharaSelecters",
            "AriaButton":"AriaButton",
            "AriaDeleteButton":"AriaDeleteButton"
        }
    );

    private characterNamesDict: Record<TTSSoftware, CharacterName[]>
    private humanImagesDict: Map<CharacterName, HumanImage[]>;
    private voiceModesDict: Map<CharacterName, VoiceMode[]>;
    public readonly component: BaseComponent<typeof this.Def["classNames"]>;
    private ttsSoftwareSelecter: TTSSoftwareSelecter;
    private compositeCharacterNameSelecter: CompositeCharacterNameSelecter;
    private compositehumanImageSelecter: CompositeHumanImageSelecter;
    private compositeVoiceModeSelecter: CompositeVoiceModeSelecter;
    private characterSelectDecisionButton: CharacterSelectDecisionButton;
    private characterSelecterDeleteButton: CharaSelecterDeleteButton;
    private _onReceiveDecideCharacterResponse = new ReactiveProperty<HumanData|null>(null);
    dragMover: DragMover;

    private human_tab: HumanTab;
    public registerHumanName: (human_name:string, human_tab:Element, ELM_human_name:HTMLElement) => void;

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
        voiceModesDict: Map<CharacterName, VoiceMode[]>,
        human_tab: HumanTab,
    ) {
        this.characterNamesDict = characterNamesDict;
        this.humanImagesDict = humanImagesDict;
        this.voiceModesDict = voiceModesDict;
        this.human_tab = human_tab;

        this.ttsSoftwareSelecter = new TTSSoftwareSelecter(this.defaultTTSSoftWare);
        this.compositeCharacterNameSelecter = new CompositeCharacterNameSelecter(characterNamesDict, this.defaultTTSSoftWare, this.defaultCharacterName);
        this.compositehumanImageSelecter = new CompositeHumanImageSelecter(humanImagesDict, this.defaultCharacterName, this.defaultHumanImage);
        this.compositeVoiceModeSelecter = new CompositeVoiceModeSelecter(voiceModesDict, this.defaultCharacterName, this.defaultVoiceMode);
        this.characterSelectDecisionButton = new CharacterSelectDecisionButton();
        this.characterSelecterDeleteButton = new CharaSelecterDeleteButton();
        this.component = BaseComponent.createElement<typeof this.Def["classNames"]>(this.Def);
        this.start();
    }

    private start(): void {
        this.initSetChildElement();
        this.definitionBehavior();
        this.component.addCSSClass("CharaSelectFunction");
    }

    private initSetChildElement(): void {
        this.setZIndex();
        this.component.createArrowBetweenComponents(this, this.ttsSoftwareSelecter, this.Def.classNames.AriaTTSSoftwareSelecter);                //TTSSoftセレクター
        this.component.createArrowBetweenComponents(this, this.compositeCharacterNameSelecter, this.Def.classNames.AriaFlexCompositeCharaSelecters);     //キャラクター名セレクター
        this.component.createArrowBetweenComponents(this, this.compositehumanImageSelecter, this.Def.classNames.AriaFlexCompositeCharaSelecters);        //人間の画像セレクター
        this.component.createArrowBetweenComponents(this, this.compositeVoiceModeSelecter, this.Def.classNames.AriaFlexCompositeCharaSelecters);         //ボイスモードセレクター
        this.component.createArrowBetweenComponents(this, this.characterSelectDecisionButton, this.Def.classNames.AriaButton);      //決定ボタン
        this.component.createArrowBetweenComponents(this, this.characterSelecterDeleteButton, this.Def.classNames.AriaDeleteButton);      //削除ボタン
        this.dragMover = new DragMover(this);
    }

    private setZIndex(): void {
        this.component.element.style.zIndex = ZIndexManager.CharaSelectFunction.toString();
    }

    private definitionBehavior(): void {
        //tts選択をすると、そのttsのキャラセレクターが表示される
        this.ttsSoftwareSelecter.addOnSelectedSoftwareChanged( (tts_software) => {
            this.compositeCharacterNameSelecter.selectedSoftware.set(tts_software);
        })
        //キャラクターが選択されたとき、画像セレクターの今のキャラの値を変更する
        this.compositeCharacterNameSelecter.addOnCharacterNameChanged((characterName) => {
            console.log("キャラクターが選択されました" + characterName.name + ": compositehumanImageSelecter");
            this.compositehumanImageSelecter.selectedCharacterName.set(characterName);
        });
        //キャラクターが選択されたとき、ボイスモードセレクターの今のキャラの値を変更する
        this.compositeCharacterNameSelecter.addOnCharacterNameChanged( (characterName) => {
            console.log("キャラクターが選択されました: " + characterName.name + ": compositeVoiceModeSelecter");
            this.compositeVoiceModeSelecter.selectedCharacterName.set(characterName);
        });
        //決定ボタンを押すと、キャラクターが決定される
        this.characterSelectDecisionButton.addOnPushButton(() => {
            this.decideCharacter();
        });
        //削除ボタンを押すと、ウィンドウが削除される
        this.characterSelecterDeleteButton.addOnPushButton(() => {
            this.deleteWiondow();
        });
    }

    private async decideCharacter(): Promise<void> {
        //キャラクターが決定されたときの処理
        const selectState = new CharacterModeState(
            this.human_tab.characterId,
            this.ttsSoftwareSelecter.selectedSoftware, 
            this.compositeCharacterNameSelecter.selectedCharacterName, 
            this.compositehumanImageSelecter.selectedHumanImage,
            this.compositeVoiceModeSelecter.selectedVoiceMode,
            new VoiceState(1),
            this.compositeCharacterNameSelecter.selectedCharacterName.name
        );
        //情報をまとめてサーバーにPostでリクエストを投げる
        console.log("キャラクターが決定されました");
        console.log(selectState);
        // this.registerHumanName(selectState.character_name.name, this.human_tab.component.element, this.ELM_human_name);
        this.human_tab.registerHumanName(selectState.character_name.name);
        let response_json:CharaCreateData = await RequestAPI.fetchOnDecideCharaInfo(selectState);
        console.log(response_json);
        // this._onReceiveDecideCharacterResponse.set(response_json);
        //サーバーから返ってきた情報を元に、キャラクターを生成する
        this.human_tab.createHuman(response_json);

        //ウィンドウを削除する
        this.deleteWiondow();
        
    }

    public addOnReceiveDecideCharacterResponse(method: (response: HumanData|null) => void): void {
        this._onReceiveDecideCharacterResponse.addMethod(method);
    }

    

    private fetchCharaInfo(): void {
        
    }

    private deleteWiondow(): void {
        //ウィンドウを削除する
        //このクラスインスタンスを削除する
        document.body.removeChild(this.component.element);
    }
}