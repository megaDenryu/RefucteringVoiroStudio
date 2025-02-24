import { ReactiveProperty } from "../../BaseClasses/EventDrivenCode/observer";
import { BaseComponent, ElementChildClass, ElementCreater, HtmlElementInput, IHasComponent } from "../Base/ui_component_base";
import { CharacterName, HumanImage, CharacterModeState, TTSSoftware, TTSSoftwareEnum, VoiceMode, NickName, CharacterSettingSaveDatas, CharacterId, CevioAICharacterSettingCollection, AIVoiceCharacterSettingCollection, CharacterSaveId } from "../../ValueObject/Character";
import { RequestAPI } from "../../Web/RequestApi";
import { HumanTab } from "../HumanDisplay/HumanWindow";
import { CharaCreateData, HumanData } from "../../ValueObject/IHumanPart";
import { ZIndexManager } from "../../AppPage/AppVoiroStudio/ZIndexManager";
import { DragMover, IDragAble } from "../Base/DragableComponent";
import { VoiceState } from "../../ValueObject/VoiceState";
import { VoMap } from "../../Extend/extend_collections";
import { CharacterInfo } from "../../ZodObject/DataStore/CharacterSetting/CharacterInfo/CharacterInfo";
import { CevioAIVoiceSetting } from "../../AppPage/CharacterSetting/VoiceSetting/CevioAIVoiceSetting";
import { AIVoiceVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/AIVoiceVoiceSetting/AIVoiceVoiceSettingModel";
import { CevioAIVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CevioAIVoiceSetting/CevioAIVoiceSettingModel";
import { VoiceVoxVoiceSetting } from "../../AppPage/CharacterSetting/VoiceSetting/VoiceVoxVoiceSetting";
import { CoeiroinkVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/CoeiroinkVoiceSetting/CoeiroinkVoiceSettingModel";
import { VoiceVoxVoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceVoxVoiceSetting/VoiceVoxVoiceSettingModel";
import { ICoeiroinkCharacterSettingCollection, IVoiceVoxCharacterSettingCollection } from "./ICharacterInfo";
import { ExtendFunction } from "../../Extend/extend";
import { createCharacterVoiceSetting } from "../../AppPage/CharacterSetting/CharacterSettingCreater";
import { VoiceSettingModel } from "../../ZodObject/DataStore/ChatacterVoiceSetting/VoiceSettingModel";
import { TtsSoftWareVoiceSettingReq } from "../../ZodObject/DataStore/ChatacterVoiceSetting/TtsSoftWareVoiceSettingReq";
import { GlobalState } from "../../AppPage/AppVoiroStudio/AppVoiroStudio";
import { simulateSelectValueChange } from "../../Extend/ExtendElement/ExtendHTMLSelectElement";
import { clickSimulate, ISelecterComponent, ISelecterComponentProxy } from "../Base/SelecterComponent/ISelecterComponent";

export class TTSSoftwareSelecter implements ISelecterComponent {
    public readonly component: BaseComponent;
    private readonly _selectedSoftware:ReactiveProperty<TTSSoftware>;
    public get selectedSoftware(): TTSSoftware { return this._selectedSoftware.get(); }
    public get selectElement(): HTMLSelectElement { return this.component.element as HTMLSelectElement; }

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

    delete(): void {
        this.component.delete();
    }

    clickSimulate(tts_software: TTSSoftware): void {
        clickSimulate(this, tts_software);
    }
}

export class CharacterNameSelecter implements ISelecterComponent {
    public readonly component: BaseComponent;
    public readonly ttsSoftware: TTSSoftware;
    private readonly characterNames: CharacterName[];
    private readonly selectedCharacterName:ReactiveProperty<CharacterName>;
    public get selectElement(): HTMLSelectElement { return this.component.element as HTMLSelectElement; }

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

    delete(): void {
        this.component.delete();
    }

    public clickSimulate(character_name: CharacterName): void {
        clickSimulate(this, character_name.name);
    }
}

export class CompositeCharacterNameSelecter implements ISelecterComponentProxy {
    public readonly component: BaseComponent;
    private readonly characterNamesDict: Record<TTSSoftware, CharacterName[]>;
    private readonly characterNameSelecterDict: Record<TTSSoftware, CharacterNameSelecter>;
    public readonly selectedSoftware:ReactiveProperty<TTSSoftware>;
    private readonly _selectedCharacterName:ReactiveProperty<CharacterName>;
    public get selectedCharacterName(): CharacterName { return this._selectedCharacterName.get(); }

    private get HTMLInput(): string {
        return `
        <div class="CompositeCharacterNameSelecter CompositeSelecterSize">
            <div class="SelecterTitle">キャラクター</div>
        </div>
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

    delete(): void {
        this.component.delete();
    }

    public clickSimulate(value:{tts_software: TTSSoftware, chara_name: CharacterName}): void {
        const selecter = this.characterNameSelecterDict[value.tts_software];
        selecter.clickSimulate(value.chara_name);
    }
}

export class HumanImageSelecter implements ISelecterComponent {
    //人間の画像が選択されたときは何を実行するんだ？決定ボタンを表示する？そもそもダブルクリックでもいいのでは？特にイベントは今のところ考えていない

    public readonly component: BaseComponent;
    private readonly _humanImages: HumanImage[];
    private readonly _selectedHumanImage: ReactiveProperty<HumanImage>;
    public get selectElement(): HTMLSelectElement { return this.component.element as HTMLSelectElement; }

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

    delete(): void {
        this.component.delete();
    }

    public clickSimulate(human_image: HumanImage): void {
        clickSimulate(this, human_image.folder_name);
    }
}

export class CompositeHumanImageSelecter implements ISelecterComponentProxy {
    public readonly component: BaseComponent;
    private readonly humanImagesDict: VoMap<CharacterName, HumanImage[]>;
    private readonly humanImageSelecterDict: VoMap<CharacterName, HumanImageSelecter>;
    //変化したときに表示するセレクターを変える
    public readonly selectedCharacterName: ReactiveProperty<CharacterName>;
    private _selectedHumanImage: HumanImage;
    public get selectedHumanImage(): HumanImage { return this._selectedHumanImage; }

    constructor(humanImagesDict: VoMap<CharacterName, HumanImage[]>, defaultCharacterName: CharacterName, defaultHumanImage: HumanImage) {
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
        <div class="CompositeHumanImageSelecter CompositeSelecterSize">
            <div class="SelecterTitle">立ち絵</div>
        </div>
        `;
    }

    private createHumanImageSelecter(humanImagesDict: VoMap<CharacterName, HumanImage[]>): VoMap<CharacterName, HumanImageSelecter> {
        const humanImageSelecterMap: VoMap<CharacterName, HumanImageSelecter> = new VoMap();
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

    delete(): void {
        this.component.delete();
    }

    public clickSimulate(value:{characterName:CharacterName, human_image:HumanImage}): void {
        const selecter = this.humanImageSelecterDict.get(value.characterName) ?? (() => {throw new Error("HumanImageSelecterが見つかりませんでした")})();
        selecter.clickSimulate(value.human_image);
    }
}

export class VoicemodeSelecter implements ISelecterComponent {
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
    public get selectElement(): HTMLSelectElement { return this.component.element as HTMLSelectElement; }

    constructor(characterName: CharacterName, VoiceModes: VoiceMode[], defaultVoiceMode: VoiceMode = VoiceModes[0]??null) {
        this.characterName = characterName;
        this._selectedVoiceMode = new ReactiveProperty<VoiceMode>(defaultVoiceMode);
        const HTMLElementInput = ElementCreater.createSelectElement(VoiceModes.map(VoiceMode => VoiceMode.mode), this.calcBoxSize());
        HTMLElementInput.addEventListener('change', (event) => {
            const voice_mode_name = (event.target as HTMLSelectElement).value;
            const voice_mode = VoiceModes.find(voiceMode => voiceMode.mode === voice_mode_name) ?? (() => {throw new Error("VoiceModeが見つかりませんでした")})();
            this._selectedVoiceMode.set(voice_mode);
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

    delete(): void {
        this.component.delete();
    }

    public clickSimulate(voice_mode: VoiceMode): void {
        clickSimulate(this, voice_mode.mode);
    }
}

export class CompositeVoiceModeSelecter implements ISelecterComponentProxy {
    component: BaseComponent;
    public readonly selectedCharacterName: ReactiveProperty<CharacterName>;
    private _selectedVoiceMode: VoiceMode;
    private voiceModesDict: VoMap<CharacterName, VoiceMode[]>;
    private voiceModeSelecterDict: VoMap<CharacterName, VoicemodeSelecter>;

    get selectedVoiceMode(): VoiceMode { return this._selectedVoiceMode; }
    get HTMLInput(): string {
        return `
        <div class="CompositeVoiceModeSelecter CompositeSelecterSize">
            <div class="SelecterTitle">ボイスモード</div>
        </div>
        `;
    }

    constructor(voiceModesDict: VoMap<CharacterName, VoiceMode[]>, defaultCharacterName: CharacterName, defaultVoiceMode: VoiceMode) {
        this.component = BaseComponent.createElementByString(this.HTMLInput);
        this.selectedCharacterName = new ReactiveProperty<CharacterName>(defaultCharacterName);
        this._selectedVoiceMode = defaultVoiceMode;
        this.voiceModesDict = voiceModesDict;
        console.log(voiceModesDict);
        this.voiceModeSelecterDict = this.createVoiceModeSelecter(voiceModesDict);
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

    private createVoiceModeSelecter(voiceModesDict: VoMap<CharacterName, VoiceMode[]>): VoMap<CharacterName, VoicemodeSelecter> {
        const voiceModeSelecter: VoMap<CharacterName, VoicemodeSelecter> = new VoMap();
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

    delete(): void {
        this.component.delete();
    }

    public clickSimulate(value:{character_name: CharacterName, voice_mode: VoiceMode}): void {
        const selecter = this.voiceModeSelecterDict.get(value.character_name) ?? (() => {throw new Error("VoiceModeSelecterが見つかりませんでした")})();
        selecter.clickSimulate(value.voice_mode);
    }
}

export interface ICharacterSettingSaveModel<T extends VoiceSettingModel> {
    saveID: CharacterSaveId;
    characterInfo: CharacterInfo;
    voiceSetting?: T;
}

export type SaveDataSelecterOptionDataset = {
    saveID: CharacterSaveId;
}

export type SaveDataSelecterOption = {
    text: string;
    dataset: SaveDataSelecterOptionDataset;
}

export class CharacterSettingSaveDataSelecter<T extends VoiceSettingModel> implements ISelecterComponent {
    component: BaseComponent;
    public readonly characterName: CharacterName;
    public readonly ttsSoftware: TTSSoftware;
    public readonly selectedSaveID: ReactiveProperty<CharacterSaveId>;
    public readonly characterSettingSaveModelList: ICharacterSettingSaveModel<T>[];
    public get selectElement(): HTMLSelectElement { return this.component.element as HTMLSelectElement; }

    public get selectedCharacterSaveData(): ICharacterSettingSaveModel<T> {
        for (const data of this.characterSettingSaveModelList) {
            if (data.saveID === this.selectedSaveID.get()) {
                return data;
            }
        }

        throw new Error("セーブデータが見つかりませんでした");
    }

    constructor(characterName: CharacterName, ttsSoftware: TTSSoftware, characterSettingSaveModelList: ICharacterSettingSaveModel<T>[]) {
        this.characterName = characterName;
        this.ttsSoftware = ttsSoftware;
        this.characterSettingSaveModelList = characterSettingSaveModelList;
        this.selectedSaveID = new ReactiveProperty<CharacterSaveId>(characterSettingSaveModelList[0].saveID);
        const selecterOptions: SaveDataSelecterOption[] = characterSettingSaveModelList.map(
            saveModel => ({"text":saveModel.characterInfo.nickName.name, "dataset":{"saveID":saveModel.saveID}})
        );
        const HTMLElementInput = ElementCreater.createSelectElementWithDataset(
            selecterOptions, 
            this.calcBoxSize(), 
            characterSettingSaveModelList[0].saveID
        );


        HTMLElementInput.addEventListener('change', (event) => {
            const selectedOptionDataset:SaveDataSelecterOptionDataset = (event.target as HTMLSelectElement).selectedOptions[0].dataset as SaveDataSelecterOptionDataset;
            const inputSaveID: CharacterSaveId = selectedOptionDataset.saveID as CharacterSaveId;
            this.selectedSaveID.set(inputSaveID);
        });
        this.component = new BaseComponent(HTMLElementInput);
        this.component.addCSSClass(["CharacterSettingSaveDataSelecter", "SelecterSize"]);
    }

    public show(): void {
        this.component.show();
        this.selectedSaveID.set(this.selectedSaveID.get());
    }
    public hide(): void {this.component.hide();}
    public delete(): void {this.component.delete();}

    public addOnSaveIDChanged(method: (saveID: CharacterSaveId) => void): void {
        this.selectedSaveID.addMethod(method);
    }

    private calcBoxSize(): number {
        return 8;
    }

    public clickSimulate(saveID: CharacterSaveId): void {
        //この関数は未検証
        const selectElement = this.selectElement;
        let found = false;
        for (let i = 0; i < selectElement.options.length; i++) {
            const option = selectElement.options[i];
            // datasetに設定しているプロパティ名は大文字小文字がそのままになるため、 
            // オプション作成時に {"saveID": value} としているなら dataset.saveID で取得可能です。
            if (option.dataset.saveID === saveID) {
                selectElement.selectedIndex = i;
                found = true;
                break;
            }
        }
        if (!found) {
            console.warn(`Option with dataset.saveID "${saveID}" not found.`);
        }
        const event = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(event);
    }
}

export interface SelectCharacterInfo {
    ttsSoftware: TTSSoftware;
    characterName: CharacterName;
}
export class CompositeCharacterSettingSaveDataSelecter implements ISelecterComponentProxy {
    component: BaseComponent;
    public readonly selectedCharacter: ReactiveProperty<SelectCharacterInfo>;
    private _characterSettingSaveData: CharacterSettingSaveDatas;
    private _characterNamesDict: Record<TTSSoftware, CharacterName[]>;
    private _cevioAISaveDataSelecterDict: VoMap<CharacterName, CharacterSettingSaveDataSelecter<CevioAIVoiceSettingModel>> = new VoMap();
    private _aiVoiceSaveDataSelecterDict: VoMap<CharacterName, CharacterSettingSaveDataSelecter<AIVoiceVoiceSettingModel>> = new VoMap();
    private _voiceVoxSaveDataSelecterDict: VoMap<CharacterName, CharacterSettingSaveDataSelecter<VoiceVoxVoiceSettingModel>> = new VoMap();
    private _coeiroinkSaveDataSelecterDict: VoMap<CharacterName, CharacterSettingSaveDataSelecter<CoeiroinkVoiceSettingModel>> = new VoMap();

    public get selectedSelecter(): CharacterSettingSaveDataSelecter<CevioAIVoiceSettingModel|AIVoiceVoiceSettingModel|VoiceVoxVoiceSettingModel|CoeiroinkVoiceSettingModel> {
        return this.getSelecter(this.selectedCharacter.get()) ?? (() => {throw new Error("セーブデータが見つかりませんでした")})();
    }

    public get selectedSaveID(): CharacterSaveId {
        return this.selectedSelecter.selectedSaveID.get();
    }

    public get selectedCharacterSaveData(): ICharacterSettingSaveModel<CevioAIVoiceSettingModel|AIVoiceVoiceSettingModel|VoiceVoxVoiceSettingModel|CoeiroinkVoiceSettingModel> {
        return this.selectedSelecter.selectedCharacterSaveData;
    }

    private get HTMLInput(): string {
        return `
        <div class="CompositeCharacterSettingSaveDataSelecter CompositeSelecterSize">
            <div class="SelecterTitle">セーブデータ</div>
        </div>
        `;
    }

    constructor(characterSettingSaveDatas: CharacterSettingSaveDatas, ttsSoftware: TTSSoftware, defaultCharacterName: CharacterName, characterNamesDict: Record<TTSSoftware, CharacterName[]>) {
        console.log("characterSettingSaveDatasを作成");
        this.component = BaseComponent.createElementByString(this.HTMLInput);
        this._characterSettingSaveData = characterSettingSaveDatas;
        this._characterNamesDict = characterNamesDict;
        this.セレクターの作成とバインド();
        //最初のキャラクターを表示し、他のキャラクターを非表示にし、選択されたキャラクターを変更する。また、選択されたセーブIDを変更する
        this.selectedCharacter = new ReactiveProperty<SelectCharacterInfo>({"ttsSoftware": ttsSoftware, "characterName": defaultCharacterName});
        this.component.addCSSClass(["CompositeCharacterSettingSaveDataSelecter","CompositeSelecterSize"]);
        console.log("characterSettingSaveDatasを作成"); 
        this.selectedSelecter.show();
        this.selectedCharacter.addMethod((newCharacter) => {
            this.changeCharacter(newCharacter);
        });
    }

    public changeCharacter(newCharacter: SelectCharacterInfo): void {
        for (const [chara_name,selecter] of this._cevioAISaveDataSelecterDict.entries()) {selecter.hide();}
        for (const [chara_name,selecter] of this._aiVoiceSaveDataSelecterDict.entries()) {selecter.hide();}
        for (const [chara_name,selecter] of this._voiceVoxSaveDataSelecterDict.entries()) {selecter.hide();}
        for (const [chara_name,selecter] of this._coeiroinkSaveDataSelecterDict.entries()) {selecter.hide();}
        this.getSelecter(newCharacter)?.show();
    }

    public getSelecter(characterInfo: SelectCharacterInfo) {
        switch (characterInfo.ttsSoftware) {
            case TTSSoftwareEnum.AIVoice:
                return this._aiVoiceSaveDataSelecterDict.get(characterInfo.characterName);
            case TTSSoftwareEnum.CevioAI:
                return this._cevioAISaveDataSelecterDict.get(characterInfo.characterName);
            case TTSSoftwareEnum.VoiceVox:
                return this._voiceVoxSaveDataSelecterDict.get(characterInfo.characterName);
            case TTSSoftwareEnum.Coeiroink:
                return this._coeiroinkSaveDataSelecterDict.get(characterInfo.characterName);
            default:
                throw new Error("TTSソフトウェアが見つかりませんでした");
        }
    }

    public delete(): void {
        this.component.delete();
    }

    public clickSimulate(value:{tts_software: TTSSoftware, chara_name: CharacterName, save_id: CharacterSaveId}): void {
        //この関数は未検証
        const selecter = this.getSelecter({"ttsSoftware": value.tts_software, "characterName": value.chara_name}) ?? (() => {throw new Error("セーブデータが見つかりませんでした")})();
        selecter.clickSimulate(value.save_id);
    }

    private セレクターの作成とバインド()  {
        for (const [characterName, saveData] of this.セーブデータの分類AIVoice(this._characterSettingSaveData.characterSettingAIVoice).entries()) {
            const selecter = new CharacterSettingSaveDataSelecter(characterName, TTSSoftwareEnum.AIVoice, saveData);
            this._aiVoiceSaveDataSelecterDict.set(characterName, selecter);
            this.component.createArrowBetweenComponents(this, selecter);
            selecter.hide();
        }

        for (const [characterName, saveData] of this.セーブデータの分類CevioAi(this._characterSettingSaveData.characterSettingCevioAI).entries()) {
            const selecter = new CharacterSettingSaveDataSelecter(characterName, TTSSoftwareEnum.CevioAI, saveData);
            this._cevioAISaveDataSelecterDict.set(characterName, selecter);
            this.component.createArrowBetweenComponents(this, selecter);
            selecter.hide();
        }

        for (const [characterName, saveData] of this.セーブデータの分類VoiceVox(this._characterSettingSaveData.characterSettingVoiceVox).entries()) {
            const selecter = new CharacterSettingSaveDataSelecter(characterName, TTSSoftwareEnum.VoiceVox, saveData);
            this._voiceVoxSaveDataSelecterDict.set(characterName, selecter);
            this.component.createArrowBetweenComponents(this, selecter);
            selecter.hide();
        }

        for (const [characterName, saveData] of this.セーブデータの分類Coeiroink(this._characterSettingSaveData.characterSettingCoeiroink).entries()) {
            const selecter = new CharacterSettingSaveDataSelecter(characterName, TTSSoftwareEnum.Coeiroink, saveData);
            this._coeiroinkSaveDataSelecterDict.set(characterName, selecter);
            this.component.createArrowBetweenComponents(this, selecter);
            selecter.hide();
        }
    }

    private 新規作成CevioAI(character_name:CharacterName):ICharacterSettingSaveModel<CevioAIVoiceSettingModel> {
        return {
            saveID: ExtendFunction.uuid(),
            characterInfo: {
                characterName: character_name,
                nickName: new NickName("新規作成:" + character_name.name),
                humanImage: new HumanImage("新規作成"),
                aiSetting: {
                    名前: "",
                    年齢: 0,
                    性別: "",
                    背景情報: "",
                    役割: "",
                    動機: "",
                    アリバイ: "",
                    性格特性: "",
                    関係: [],
                    秘密: "",
                    知っている情報: "",
                    外見の特徴: "",
                    所持品: [],
                    行動パターン: [],
                }
            },
            voiceSetting: undefined,
        };
    }

    private 新規作成AIVoice(character_name:CharacterName):ICharacterSettingSaveModel<AIVoiceVoiceSettingModel> {
        return {
            saveID: ExtendFunction.uuid(),
            characterInfo: {
                characterName: character_name,
                nickName: new NickName("新規作成:" + character_name.name),
                humanImage: new HumanImage("新規作成"),
                aiSetting: {
                    名前: "",
                    年齢: 0,
                    性別: "",
                    背景情報: "",
                    役割: "",
                    動機: "",
                    アリバイ: "",
                    性格特性: "",
                    関係: [],
                    秘密: "",
                    知っている情報: "",
                    外見の特徴: "",
                    所持品: [],
                    行動パターン: [],
                }
            },
            voiceSetting: undefined,
        };
    }

    private 新規作成VoiceVox(character_name:CharacterName):ICharacterSettingSaveModel<VoiceVoxVoiceSettingModel> {
        return {
            saveID: ExtendFunction.uuid(),
            characterInfo: {
                characterName: character_name,
                nickName: new NickName("新規作成:" + character_name.name),
                humanImage: new HumanImage("新規作成"),
                aiSetting: {
                    名前: "",
                    年齢: 0,
                    性別: "",
                    背景情報: "",
                    役割: "",
                    動機: "",
                    アリバイ: "",
                    性格特性: "",
                    関係: [],
                    秘密: "",
                    知っている情報: "",
                    外見の特徴: "",
                    所持品: [],
                    行動パターン: [],
                }
            },
            voiceSetting: undefined,
        };
    }

    private 新規作成Coeiroink(character_name:CharacterName):ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel> {
        return {
            saveID: ExtendFunction.uuid(),
            characterInfo: {
                characterName: character_name,
                nickName: new NickName("新規作成:" + character_name.name),
                humanImage: new HumanImage("新規作成"),
                aiSetting: {
                    名前: "",
                    年齢: 0,
                    性別: "",
                    背景情報: "",
                    役割: "",
                    動機: "",
                    アリバイ: "",
                    性格特性: "",
                    関係: [],
                    秘密: "",
                    知っている情報: "",
                    外見の特徴: "",
                    所持品: [],
                    行動パターン: [],
                }
            },
            voiceSetting: undefined,
        };
    }

    private セーブデータの分類CevioAi(characterSettingCevioAI: CevioAICharacterSettingCollection): VoMap<CharacterName, ICharacterSettingSaveModel<CevioAIVoiceSettingModel>[]> {
        const ceviAISaveData = new VoMap<CharacterName, ICharacterSettingSaveModel<CevioAIVoiceSettingModel>[]>();
        for (const saveData of characterSettingCevioAI.collection) {
            const charaName = CharacterName.fromDict(saveData.characterInfo.characterName);
            if (ceviAISaveData.has(charaName)) {
                ceviAISaveData.get(charaName)?.push(saveData);
            } else {
                ceviAISaveData.set(charaName, [saveData]);
            }
        }
        //全てのキャラに新規作成を追加する
        for (const charaName of this._characterNamesDict[TTSSoftwareEnum.CevioAI]) {
            if (!ceviAISaveData.has(charaName)) {
                ceviAISaveData.set(charaName, [this.新規作成CevioAI(charaName)]);
            } else {
                ceviAISaveData.get(charaName)?.push(this.新規作成CevioAI(charaName));
            }
        }
        return ceviAISaveData;
    }

    private セーブデータの分類AIVoice(characterSettingAIVoice: AIVoiceCharacterSettingCollection): VoMap<CharacterName, ICharacterSettingSaveModel<AIVoiceVoiceSettingModel>[]> {
        const aiVoiceSaveData = new VoMap<CharacterName, ICharacterSettingSaveModel<AIVoiceVoiceSettingModel>[]>();
        for (const saveData of characterSettingAIVoice.collection) {
            const charaName = CharacterName.fromDict(saveData.characterInfo.characterName);
            if (aiVoiceSaveData.has(charaName)) {
                aiVoiceSaveData.get(charaName)?.push(saveData);
            } else {
                aiVoiceSaveData.set(charaName, [saveData]);
            }
        }
        //全てのキャラに新規作成を追加する
        for (const charaName of this._characterNamesDict[TTSSoftwareEnum.AIVoice]) {
            if (!aiVoiceSaveData.has(charaName)) {
                aiVoiceSaveData.set(charaName, [this.新規作成AIVoice(charaName)]);
            } else {
                aiVoiceSaveData.get(charaName)?.push(this.新規作成AIVoice(charaName));
            }
        }

        return aiVoiceSaveData;
    }

    private セーブデータの分類VoiceVox(characterSettingVoiceVox: IVoiceVoxCharacterSettingCollection): VoMap<CharacterName, ICharacterSettingSaveModel<VoiceVoxVoiceSettingModel>[]> {
        const voiceVoxSaveData = new VoMap<CharacterName, ICharacterSettingSaveModel<VoiceVoxVoiceSettingModel>[]>();
        for (const saveData of characterSettingVoiceVox.collection) {
            const charaName = CharacterName.fromDict(saveData.characterInfo.characterName);
            if (voiceVoxSaveData.has(charaName)) {
                voiceVoxSaveData.get(charaName)?.push(saveData);
            } else {
                voiceVoxSaveData.set(charaName, [saveData]);
            }
        }

        //全てのキャラに新規作成を追加する
        for (const charaName of this._characterNamesDict[TTSSoftwareEnum.VoiceVox]) {
            if (!voiceVoxSaveData.has(charaName)) {
                voiceVoxSaveData.set(charaName, [this.新規作成VoiceVox(charaName)]);
            } else {
                voiceVoxSaveData.get(charaName)?.push(this.新規作成VoiceVox(charaName));
            }
        }
        return voiceVoxSaveData;
    }

    private セーブデータの分類Coeiroink(characterSettingCoeiroink: ICoeiroinkCharacterSettingCollection): VoMap<CharacterName, ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>[]> {
        const coeiroinkSaveData = new VoMap<CharacterName, ICharacterSettingSaveModel<CoeiroinkVoiceSettingModel>[]>();
        for (const saveData of characterSettingCoeiroink.collection) {
            const charaName = CharacterName.fromDict(saveData.characterInfo.characterName);
            if (coeiroinkSaveData.has(charaName)) {
                coeiroinkSaveData.get(charaName)?.push(saveData);
            } else {
                coeiroinkSaveData.set(charaName, [saveData]);
            }
        }
        // 全てのキャラに新規作成を追加する
        for (const charaName of this._characterNamesDict[TTSSoftwareEnum.Coeiroink]) {
            if (!coeiroinkSaveData.has(charaName)) {
                coeiroinkSaveData.set(charaName, [this.新規作成Coeiroink(charaName)]);
            } else {
                coeiroinkSaveData.get(charaName)?.push(this.新規作成Coeiroink(charaName));
            }
        }

        return coeiroinkSaveData;
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

    delete(): void {
        this.component.delete();
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

    delete(): void {
        this.component.delete();
    }
}


export class CharaSelectFeature implements IHasComponent, IDragAble {
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
    private humanImagesDict: VoMap<CharacterName, HumanImage[]>;
    private voiceModesDict: VoMap<CharacterName, VoiceMode[]>;
    private characterSettingSaveDatas: CharacterSettingSaveDatas;
    public readonly component: BaseComponent<typeof this.Def["classNames"]>;
    private ttsSoftwareSelecter: TTSSoftwareSelecter;
    private compositeCharacterNameSelecter: CompositeCharacterNameSelecter;
    private compositehumanImageSelecter: CompositeHumanImageSelecter;
    private compositeVoiceModeSelecter: CompositeVoiceModeSelecter;
    private compositeCharacterSettingSaveDataSelecter: CompositeCharacterSettingSaveDataSelecter;
    private characterSelectDecisionButton: CharacterSelectDecisionButton;
    private characterSelecterDeleteButton: CharaSelecterDeleteButton;
    private _onReceiveDecideCharacterResponse = new ReactiveProperty<HumanData|null>(null);
    private _noHumanImage = false;
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
            if (this._noHumanImage) {
                return characterName;
            }

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
        this._noHumanImage = true;
        return new HumanImage("NoHumanImage");
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
        humanImagesDict: VoMap<CharacterName, HumanImage[]>,
        voiceModesDict: VoMap<CharacterName, VoiceMode[]>,
        characterSettingSaveDatas: CharacterSettingSaveDatas,
        human_tab: HumanTab,
    ) {
        this.characterNamesDict = characterNamesDict;
        this.humanImagesDict = humanImagesDict;
        this.voiceModesDict = voiceModesDict;
        this.characterSettingSaveDatas = characterSettingSaveDatas;
        this.human_tab = human_tab;

        this.ttsSoftwareSelecter = new TTSSoftwareSelecter(this.defaultTTSSoftWare);
        this.compositeCharacterNameSelecter = new CompositeCharacterNameSelecter(characterNamesDict, this.defaultTTSSoftWare, this.defaultCharacterName);
        this.compositehumanImageSelecter = new CompositeHumanImageSelecter(humanImagesDict, this.defaultCharacterName, this.defaultHumanImage);
        this.compositeVoiceModeSelecter = new CompositeVoiceModeSelecter(voiceModesDict, this.defaultCharacterName, this.defaultVoiceMode);
        this.compositeCharacterSettingSaveDataSelecter = new CompositeCharacterSettingSaveDataSelecter(characterSettingSaveDatas, this.defaultTTSSoftWare, this.defaultCharacterName, this.characterNamesDict);
        this.characterSelectDecisionButton = new CharacterSelectDecisionButton();
        this.characterSelecterDeleteButton = new CharaSelecterDeleteButton();
        this.component = BaseComponent.createElement<typeof this.Def["classNames"]>(this.Def);
        this.start();
    }

    private start(): void {
        this.initSetChildElement();
        this.definitionBehavior();
        this.component.addCSSClass("CharaSelectFunction");

        this.ttsSoftwareSelecter.clickSimulate(this.defaultTTSSoftWare);
        this.compositeCharacterNameSelecter.clickSimulate({tts_software: this.defaultTTSSoftWare, chara_name: this.defaultCharacterName});
        this.compositehumanImageSelecter.clickSimulate({characterName: this.defaultCharacterName, human_image: this.defaultHumanImage});
        this.compositeVoiceModeSelecter.clickSimulate({character_name: this.defaultCharacterName, voice_mode: this.defaultVoiceMode});
        //this.compositeCharacterSettingSaveDataSelecter は初期化時に選択されているので、ここではclickSimulateを呼び出さない
    }

    private initSetChildElement(): void {
        this.setZIndex();
        this.component.createArrowBetweenComponents(this, this.ttsSoftwareSelecter, this.Def.classNames.AriaTTSSoftwareSelecter);                //TTSSoftセレクター
        this.component.createArrowBetweenComponents(this, this.compositeCharacterNameSelecter, this.Def.classNames.AriaFlexCompositeCharaSelecters);     //キャラクター名セレクター
        this.component.createArrowBetweenComponents(this, this.compositehumanImageSelecter, this.Def.classNames.AriaFlexCompositeCharaSelecters);        //人間の画像セレクター
        this.component.createArrowBetweenComponents(this, this.compositeVoiceModeSelecter, this.Def.classNames.AriaFlexCompositeCharaSelecters);         //ボイスモードセレクター
        this.component.createArrowBetweenComponents(this, this.compositeCharacterSettingSaveDataSelecter, this.Def.classNames.AriaFlexCompositeCharaSelecters); //キャラクターセーブデータセレクター
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
        //キャラクターが選択されたとき、キャラクターセーブデータセレクターの今のキャラの値を変更する
        this.compositeCharacterNameSelecter.addOnCharacterNameChanged( (characterName) => {
            console.log("キャラクターが選択されました: " + characterName.name + ": compositeCharacterSettingSaveDataSelecter");
            this.compositeCharacterSettingSaveDataSelecter.selectedCharacter.set({"ttsSoftware": this.ttsSoftwareSelecter.selectedSoftware, "characterName": characterName});
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
            this.compositeCharacterSettingSaveDataSelecter.selectedSaveID,
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
        this.human_tab.registerHumanInfo(new NickName(selectState.character_name.name));
        let response_json:CharaCreateData = await RequestAPI.fetchOnDecideCharaInfo(selectState);
        console.log(response_json);
        // this._onReceiveDecideCharacterResponse.set(response_json);
        //サーバーから返ってきた情報を元に、キャラクターを生成する
        this.human_tab.createHuman(response_json);

        //キャラクターのボイス設定を生成する
        const charactersaveData = this.compositeCharacterSettingSaveDataSelecter.selectedCharacterSaveData;
        const characterId = this.human_tab.characterId;
        const tts_software = this.human_tab.characterModeState?.tts_software;
        if (tts_software == null) {return;}
        const req:TtsSoftWareVoiceSettingReq = {
            page_mode: "App",
            client_id: GlobalState.client_id,
            character_id: characterId,
        }
        this.human_tab.characterSetting = await createCharacterVoiceSetting(req, tts_software, charactersaveData);

        //ウィンドウを削除する
        this.deleteWiondow();
        
    }

    public addOnReceiveDecideCharacterResponse(method: (response: HumanData|null) => void): void {
        this._onReceiveDecideCharacterResponse.addMethod(method);
    }

    private deleteWiondow(): void {
        //ウィンドウを削除する
        //このクラスインスタンスを削除する
        document.body.removeChild(this.component.element);
    }

    delete(): void {
        this.component.delete();
    }
}