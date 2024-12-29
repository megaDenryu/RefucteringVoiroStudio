import { ZIndexManager } from "../../AppPage/AppVoiroStudio/ZIndexManager";
import { ReactiveProperty } from "../../BaseClasses/EventDrivenCode/observer";
import { VoMap } from "../../Extend/extend_collections";
import { TTSSoftware, CharacterName, HumanImage, VoiceMode, CharacterModeState } from "../../ValueObject/Character";
import { HumanData } from "../../ValueObject/IHumanPart";
import { VoiceState } from "../../ValueObject/VoiceState";
import { IDragAble, DragMover } from "../Base/DragableComponent";
import { BaseComponent, HtmlElementInput, IHasComponent } from "../Base/ui_component_base";
import { HumanTab } from "../HumanDisplay/HumanWindow";
import { CompositeHumanImageSelecter, CompositeVoiceModeSelecter, CharacterSelectDecisionButton, CharaSelecterDeleteButton } from "./CharaInfoSelecter";

export class CharaModeChangeFunction implements IHasComponent, IDragAble {
    private readonly Def = HtmlElementInput.new(
        `
            <div class="CharaSelectFunction">
                <div class="AriaFlexCompositeCharaSelecters"></div>
                <div class="AriaButton"></div>
                <div class="AriaDeleteButton"></div>
            </div>
        `,
        {
            "AriaFlexCompositeCharaSelecters":"AriaFlexCompositeCharaSelecters",
            "AriaButton":"AriaButton",
            "AriaDeleteButton":"AriaDeleteButton"
        }
    );

    private readonly ttsSoftware: TTSSoftware;
    private readonly characterName: CharacterName;
    private characterNamesDict: Record<TTSSoftware, CharacterName[]>
    private humanImagesDict: VoMap<CharacterName, HumanImage[]>;
    private voiceModesDict: VoMap<CharacterName, VoiceMode[]>;
    public readonly component: BaseComponent<typeof this.Def["classNames"]>;
    private compositehumanImageSelecter: CompositeHumanImageSelecter;
    private compositeVoiceModeSelecter: CompositeVoiceModeSelecter;
    private characterSelectDecisionButton: CharacterSelectDecisionButton;
    private characterSelecterDeleteButton: CharaSelecterDeleteButton;
    private _onReceiveDecideCharacterResponse = new ReactiveProperty<HumanData|null>(null);
    dragMover: DragMover;

    private human_tab: HumanTab;
    public registerHumanName: (human_name:string, human_tab:Element, ELM_human_name:HTMLElement) => void;

    delete(): void {
        this.component.delete();
    }

    get defaultTTSSoftWare(): TTSSoftware {
        return this.ttsSoftware;
    }

    get defaultCharacterName(): CharacterName {
        //defaultHumanImageが選択されているCharacterNameを返す
        return this.characterName;
    }

    get defaultHumanImage(): HumanImage {
        //全てのHumanImageの中で要素が１つ以上あるものを返す
        const human_image = this.human_tab.characterModeState?.human_image;
        if (human_image != null) {
            console.log(human_image);
            return human_image;
        }
        for (const [characterName, humanImage] of this.humanImagesDict.entries()) {
            if (humanImage.length > 0) {
                return humanImage[0];
            }
        }
        throw new Error("No HumanImage");
    }

    get defaultVoiceMode(): VoiceMode {
        // defaultCharacterNameが選択されているVoiceModeを返す
        const voice_mode = this.human_tab.characterModeState?.voice_mode;
        if (voice_mode != null) {
            console.log(voice_mode);
            return voice_mode;
        }
        const t: VoiceMode[] | undefined = this.voiceModesDict.get(this.defaultCharacterName)
        if (t != null) {
            return t[0];
        }
        console.log(this.voiceModesDict);
        console.log(this.defaultCharacterName);

        throw new Error("全てのキャラにボイスモードがあるはずなので、ここには来ないはず");
    }

    constructor(
        ttsSoftware: TTSSoftware,
        characterName: CharacterName,
        characterNamesDict: Record<TTSSoftware, CharacterName[]>, 
        humanImagesDict: VoMap<CharacterName, HumanImage[]>,
        voiceModesDict: VoMap<CharacterName, VoiceMode[]>,
        human_tab: HumanTab,
    ) {
        this.ttsSoftware = ttsSoftware;
        this.characterName = characterName;
        this.characterNamesDict = characterNamesDict;
        this.humanImagesDict = humanImagesDict;
        this.voiceModesDict = voiceModesDict;
        this.human_tab = human_tab;
        console.log(this.defaultHumanImage, this.defaultVoiceMode);
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
            this.ttsSoftware,
            this.characterName,
            this.compositehumanImageSelecter.selectedHumanImage,
            this.compositeVoiceModeSelecter.selectedVoiceMode,
            new VoiceState(1),
            this.characterName.name
        );
        this.human_tab.characterModeState = selectState;
        this.deleteWiondow();
        
    }

    public addOnReceiveDecideCharacterResponse(method: (response: HumanData|null) => void): void {
        this._onReceiveDecideCharacterResponse.addMethod(method);
    }

    

    private fetchCharaInfo(): void {
        
    }

    private deleteWiondow(): void {
        //このクラスインスタンスを削除する
        document.body.removeChild(this.component.element);
    }
}