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

export class CharaSelectFunction implements IHasComponent {
    private characterNamesDict: Record<TTSSoftware, CharacterName[]>
    private humanImagesDict: Map<CharacterName, HumanImage[]>;
    public readonly component: BaseComponent;
    private ttsSoftwareSelecter: TTSSoftwareSelecter;
    private compositeCharacterNameSelecter: CompositeCharacterNameSelecter;
    private compositehumanImageSelecter: CompositeHumanImageSelecter;

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

    constructor(characterNamesDict: Record<TTSSoftware, CharacterName[]>, humanImagesDict: Map<CharacterName, HumanImage[]>) {
        this.characterNamesDict = characterNamesDict;
        this.humanImagesDict = humanImagesDict;

        this.ttsSoftwareSelecter = new TTSSoftwareSelecter();
        this.compositeCharacterNameSelecter = new CompositeCharacterNameSelecter(characterNamesDict, this.defaultTTSSoftWare, this.defaultCharacterName);
        this.compositehumanImageSelecter = new CompositeHumanImageSelecter(humanImagesDict, this.defaultCharacterName, this.defaultHumanImage);

        const componentDefString = this.componentDefString();

        this.component = new BaseComponent(componentDefString);
        this.initSetChildElement();
    }

    componentDefString(): string {
        return `
        <div class="CharaSelectFunction">
            <div class="TTSSoftwareSelecter"></div>
            <div class="CharacterNameSelecter"></div>
            <div class="HumanImageSelecter"></div>
        </div>
        `;
    }

    initSetChildElement(): void {
        this.component.createChildComponentCluster();
        if (this.component.childCompositeCluster === null) throw new Error("childCompositeCluster is null");
        this.component.createArrowBetweenComponents(this, this.ttsSoftwareSelecter);
        this.component.createArrowBetweenComponents(this, this.compositeCharacterNameSelecter);
        this.component.createArrowBetweenComponents(this, this.compositehumanImageSelecter);
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
        );
        //情報をまとめてサーバーにPostでリクエストを投げる
        
        //サーバーから返ってきた情報を元に、キャラクターを生成する
        //送るapiエンドポイントの名前は
        
    }
}