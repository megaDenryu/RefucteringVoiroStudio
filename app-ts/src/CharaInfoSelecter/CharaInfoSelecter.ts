import { BaseComponent, ElementCreater } from "../UiComponent/ui_component_base";
import { CharacterName, HumanImage, TTSSoftware, TTSSoftwareEnum } from "../ValueObject/Character";



export class TTSSoftwareSelecter {
    component: BaseComponent;
    private _selectedSoftware: TTSSoftware;
    selectElement: HTMLSelectElement;
    onSelectedSoftwareChanged: Array<(value: TTSSoftware) => void> = [];

    get selectedSoftware(): TTSSoftware {
        return this._selectedSoftware;
    }

    set selectedSoftware(value: TTSSoftware) {
        this._selectedSoftware = value;
        for (const onSelectedSoftwareChanged of this.onSelectedSoftwareChanged) {
            onSelectedSoftwareChanged(value);
        }
    }

    addOnSelectedSoftwareChanged(method: (value: TTSSoftware) => void): void {
        this.onSelectedSoftwareChanged.push(method);
    }

    constructor() {
        this.selectedSoftware = TTSSoftwareEnum.CevioAI;
        this.selectElement = ElementCreater.createSelectElement(TTSSoftwareEnum.values, this.calcBoxSize());
        this.component = new BaseComponent(this.selectElement);
        this.selectElement.addEventListener('change', (event) => {
            this.selectedSoftware = TTSSoftwareEnum.check((event.target as HTMLSelectElement).value);
        });
    }

    calcBoxSize(): number {
        return Object.values(TTSSoftwareEnum).length;
    }
}

export class CharacterNameSelecter {
    component: BaseComponent;
    ttsSoftware: TTSSoftware;
    characterNames: CharacterName[];
    selectedCharacterName: CharacterName | null;

    constructor(ttsSoftware: TTSSoftware, characterNames: CharacterName[]) {
        this.ttsSoftware = ttsSoftware;
        this.selectedCharacterName = characterNames[0] ?? null;
        const HTMLElementInput = ElementCreater.createSelectElement(characterNames.map(characterName => characterName.name), this.calcBoxSize());
        HTMLElementInput.addEventListener('change', (event) => {
            this.selectedCharacterName = new CharacterName((event.target as HTMLSelectElement).value);
            console.log(this.selectedCharacterName);
        });
        this.component = new BaseComponent(HTMLElementInput);
    }

    calcBoxSize(): number {
        return 8;
    }

    changeTTS(ttsSoftware: TTSSoftware): void {
        this.ttsSoftware = ttsSoftware;
        //ここでセレクトボックスの中身を変更する
    }

    show(): void {
        this.component.show();
    }

    hide(): void {
        this.component.hide();
    }
}

export class CompositeCharacterNameSelecter {
    component: BaseComponent;
    characterNamesDict: Record<TTSSoftware, CharacterName[]>;
    characterNameSelecterDict: Record<TTSSoftware, CharacterNameSelecter>;
    private _selectedSoftware: TTSSoftware;
    private _selectedCharacterName: CharacterName;
    onCharacterNameChanged: Array<(characterName: CharacterName) => void> = [];

    get selectedSoftware(): TTSSoftware {
        return this._selectedSoftware;
    }

    set selectedSoftware(value: TTSSoftware) {
        this._selectedSoftware = value;
        this.changeCharacterNameSelecter(value);
    }

    get selectedCharacterName(): CharacterName {
        return this._selectedCharacterName;
    }

    set onSelectedCharacterName(characterName: CharacterName) {
        this._selectedCharacterName = characterName;
        this.OnCharacterNameChanged(characterName);
    }

    OnCharacterNameChanged(characterName: CharacterName): void {
        for (const onCharacterNameChanged of this.onCharacterNameChanged) {
            onCharacterNameChanged(characterName);
        }
    }

    addOnCharacterNameChanged(method: (characterName: CharacterName) => void): void {
        this.onCharacterNameChanged.push(method);
    }

    get HTMLInput(): string {
        return `
        <div class="CompositeCharacterNameSelecter"></div>
        `;
    }

    constructor(characterNamesDict: Record<TTSSoftware, CharacterName[]>, defaultTTSSoftWare: TTSSoftware) {
        this.component = new BaseComponent(this.HTMLInput);
        this.characterNamesDict = characterNamesDict;
        this.characterNameSelecterDict = {
            "AIVoice": new CharacterNameSelecter(TTSSoftwareEnum.AIVoice, characterNamesDict[TTSSoftwareEnum.AIVoice]),
            "CevioAI": new CharacterNameSelecter(TTSSoftwareEnum.CevioAI, characterNamesDict[TTSSoftwareEnum.CevioAI]),
            "VoiceVox": new CharacterNameSelecter(TTSSoftwareEnum.VoiceVox, characterNamesDict[TTSSoftwareEnum.VoiceVox]),
            "Coeiroink": new CharacterNameSelecter(TTSSoftwareEnum.Coeiroink, characterNamesDict[TTSSoftwareEnum.Coeiroink]),
        };
        this.selectedSoftware = defaultTTSSoftWare;
    }

    setGraph(): void {
        this.component.createArrowBetweenComponents(this.component, this.characterNameSelecterDict[TTSSoftwareEnum.AIVoice].component);
        this.component.createArrowBetweenComponents(this.component, this.characterNameSelecterDict[TTSSoftwareEnum.CevioAI].component);
        this.component.createArrowBetweenComponents(this.component, this.characterNameSelecterDict[TTSSoftwareEnum.VoiceVox].component);
        this.component.createArrowBetweenComponents(this.component, this.characterNameSelecterDict[TTSSoftwareEnum.Coeiroink].component);
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
}

export class HumanImageSelecter {
    component: BaseComponent;
    humanImages: HumanImage[];
    selectedHumanImage: HumanImage;

    constructor(humanImages: HumanImage[]) {
        this.humanImages = humanImages;
        this.selectedHumanImage = humanImages[0];
        const HTMLElementInput = ElementCreater.createSelectElement(humanImages.map(humanImage => humanImage.folder_name), this.calcBoxSize());
        HTMLElementInput.addEventListener('change', (event) => {
            this.selectedHumanImage = new HumanImage((event.target as HTMLSelectElement).value);
            console.log(this.selectedHumanImage);
        });
        this.component = new BaseComponent(HTMLElementInput);
    }

    calcBoxSize(): number {
        return 8;
    }
}

export class CompositeHumanImageSelecter {
    component: BaseComponent;
    humanImagesDict: Record<string, HumanImage[]>;
    humanImageSelecter: Record<string, HumanImageSelecter>;
    selectedCharacterName: CharacterName;
    selectedHumanImage: HumanImage;

    constructor(humanImagesDict: Record<string, HumanImage[]>, defaultCharacterName: CharacterName, defaultHumanImage: HumanImage) {
        this.component = new BaseComponent(this.HTMLInput);
        this.humanImagesDict = humanImagesDict;
        this.humanImageSelecter = {};
        Object.entries(humanImagesDict).forEach(([characterName, humanImages]) => {
            this.humanImageSelecter[characterName] = new HumanImageSelecter(humanImages);
        });
        this.selectedCharacterName = defaultCharacterName;
        this.selectedHumanImage = defaultHumanImage;

        this.setGraph();
    }

    get HTMLInput(): string {
        return `
        <div class="CompositeHumanImageSelecter"></div>
        `;
    }

    setGraph(): void {
        for (const [characterName, humanImageSelecter] of Object.entries(this.humanImageSelecter)) {
            this.component.createArrowBetweenComponents(this.component, humanImageSelecter.component);
        }
    }
}

export class CharaSelectFunction {
    Component: BaseComponent;
    ttsSoftwareSelecter: TTSSoftwareSelecter;
    compositeCharacterNameSelecter: CompositeCharacterNameSelecter;
    compositehumanImageSelecter: CompositeHumanImageSelecter;
    humanImageSelecter: Record<string, HumanImageSelecter>;

    get defaultTTSSoftWare(): TTSSoftware {
        const defaultCharacterName = this.defaultCharacterName;
        throw new Error("No TTSSoftware");
    }

    get defaultCharacterName(): CharacterName {
        for (const [name, humanImageSelecter] of Object.entries(this.humanImageSelecter)) {
            if (humanImageSelecter.humanImages.length > 0) {
                return new CharacterName(name);
            }
        }
        throw new Error("No characterName");
    }

    get defaultHumanImageSelecter(): HumanImageSelecter {
        return this.humanImageSelecter[this.defaultCharacterName.name];
    }

    constructor(characterNamesDict: Record<TTSSoftware, CharacterName[]>, humanImagesDict: Record<string, HumanImage[]>) {
        this.ttsSoftwareSelecter = new TTSSoftwareSelecter();
        this.compositeCharacterNameSelecter = new CompositeCharacterNameSelecter(characterNamesDict, this.defaultTTSSoftWare);
        this.compositehumanImageSelecter = new CompositeHumanImageSelecter(humanImagesDict, this.defaultCharacterName, this.defaultHumanImageSelecter.selectedHumanImage);
        this.humanImageSelecter = {};
        Object.entries(humanImagesDict).forEach(([characterName, humanImages]) => {
            this.humanImageSelecter[characterName] = new HumanImageSelecter(humanImages);
        });

        const componentDefString = this.componentDefString();

        this.Component = new BaseComponent(componentDefString);
        this.initSetChaildElement();
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

    initSetChaildElement(): void {
        this.Component.createChildComponentCluster();
        if (this.Component.childCompositeCluster === null) throw new Error("childCompositeCluster is null");
        this.Component.childCompositeCluster.createArrowBetweenComponents(this.Component, this.ttsSoftwareSelecter.component);
        this.Component.childCompositeCluster.createArrowBetweenComponents(this.Component, this.compositeCharacterNameSelecter.component);
        this.Component.childCompositeCluster.createArrowBetweenComponents(this.Component, this.defaultHumanImageSelecter.component);
    }

    definitionBehavior(): void {
        this.ttsSoftwareSelecter.addOnSelectedSoftwareChanged(this.compositeCharacterNameSelecter.changeCharacterNameSelecter.bind(this.compositeCharacterNameSelecter));
        this.compositeCharacterNameSelecter.addOnCharacterNameChanged(this.compositehumanImageSelecter.setGraph.bind(this.compositehumanImageSelecter));
    }
}