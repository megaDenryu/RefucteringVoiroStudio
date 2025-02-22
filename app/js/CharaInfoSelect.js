///@ts-check

// import { BaseComponent, ElementCreater } from "./BaseClass";

/**
 * @typedef {"CevioAI"|"VoiceVox"|"AIVoice"|"Coeiroink"} TTSSoftware
 */

class TTSSoftwareEnum {
    /**@type {TTSSoftware} */
    static CevioAI = "CevioAI";
    /**@type {TTSSoftware} */
    static VoiceVox = "VoiceVox";
    /**@type {TTSSoftware} */
    static AIVoice = "AIVoice";
    /**@type {TTSSoftware} */
    static Coeiroink = "Coeiroink";

    /**
     * @param {any} value
     * @return {TTSSoftware}
     * */
    static check(value) {
        if (value === TTSSoftwareEnum.CevioAI) return TTSSoftwareEnum.CevioAI;
        if (value === TTSSoftwareEnum.VoiceVox) return TTSSoftwareEnum.VoiceVox;
        if (value === TTSSoftwareEnum.AIVoice) return TTSSoftwareEnum.AIVoice;
        if (value === TTSSoftwareEnum.Coeiroink) return TTSSoftwareEnum.Coeiroink;
        throw new Error("Invalid TTSSoftware");
    }
}

class CharacterName {
    /** @type {string} */
    name;

    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }
}

class NickName {
    /** @type {string} */
    name;

    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }
}

class VoiceMode {
    /** @type {string} */
    mode;
    /** @type {number | null} */
    id;
    /** @type {string | null} */
    id_str;

    /**
     * @param {string} mode
     * @param {number | null} [id=null]
     * @param {string | null} [id_str=null]
     */
    constructor(mode, id = null, id_str = null) {
        this.mode = mode;
        this.id = id;
        this.id_str = id_str;
    }
}

class HumanImage {
    /** @type {string} */
    folder_name;

    /**
     * @param {string} folder_name
     * */
    constructor(folder_name) {
        this.folder_name = folder_name;
    }
}

class TTSSoftwareSelecter {
    /** @type {BaseComponent} */
    component;

    /** @type {TTSSoftware} */
    _selectedSoftware;

    /** @type {HTMLSelectElement} */
    selectElement;

    get selectedSoftware() {
        return this._selectedSoftware;
    }

    /** @param {TTSSoftware} value*/
    set selectedSoftware(value) {
        this._selectedSoftware = value;
        for (const onSelectedSoftwareChanged of this.onSelectedSoftwareChanged) {
            onSelectedSoftwareChanged(value);
        }
    }

    /**
     * selectedSoftwareの中で実行したいほかのオブジェクトのメソッドを登録する
     * @type {Array<(TTSSoftware) => void>}
     */
    onSelectedSoftwareChanged = [];

    /**
     * selectedSoftwareの中で実行したいほかのオブジェクトのメソッドを登録する
     * @param {(TTSSoftware) => void} method
     */
    addOnSelectedSoftwareChanged(method) {
        this.onSelectedSoftwareChanged.push(method);
    }


    
    constructor() {
        this.selectedSoftware = TTSSoftwareEnum.CevioAI;
        this.selectElement = ElementCreater.createSelectElement(Object.values(TTSSoftwareEnum), this.calcBoxSize());
        this.component = new BaseComponent(this.selectElement);
        this.selectElement.addEventListener('change', (event) => {
            // @ts-ignore
            this.selectedSoftware = TTSSoftwareEnum.check(event.target.value); // ここでTTSSoftware型になる
        });
    }

    calcBoxSize() {
        const size = Object.values(TTSSoftwareEnum).length;
        return size;
    }
}

class CharacterNameSelecter {
    /**
     * キャラクター名を選択するセレクトボックスを表示する。
     * TTSソフトウェアによってキャラクター名が変わる。
     * 
     */
    /** @type {BaseComponent} */ component;
    /** @type {TTSSoftware} */ ttsSoftware;
    /** @type {CharacterName[]} */ characterNames;
    /** @type {CharacterName|null} */ selectedCharacterName;

    /**
     * @param {TTSSoftware} ttsSoftware
     * @param {CharacterName[]} characterNames
     */
    constructor(ttsSoftware, characterNames) {
        this.ttsSoftware = ttsSoftware;
        this.selectedCharacterName = characterNames[0]??null;
        const HTMLElementInput = ElementCreater.createSelectElement(characterNames.map(characterName => characterName.name), this.calcBoxSize());
        HTMLElementInput.addEventListener('change', (event) => {
            // @ts-ignore
            this.selectedCharacterName = new CharacterName(event.target.value);
            console.log(this.selectedCharacterName);
        });
        this.component = new BaseComponent(HTMLElementInput);
    }

    calcBoxSize() {
        return 8;
    }

    changeTTS(ttsSoftware) {
        this.ttsSoftware = ttsSoftware;
        //ここでセレクトボックスの中身を変更する

    }

    show() {
        this.component.show();
    }

    hide() {
        this.component.hide();
    }
}

class CompositeCharacterNameSelecter {
    /** @type {BaseComponent} */ component;
    /** @type {Record<TTSSoftware,CharacterName[]>} */ characterNamesDict;
    /** @type {Record<TTSSoftware,CharacterNameSelecter>} */ characterNameSelecterDict;
    /** @type {TTSSoftware} */ _selectedSoftware;

    get selectedSoftware() {
        return this._selectedSoftware;
    }

    /** @param {TTSSoftware} value*/
    set selectedSoftware(value) {
        this._selectedSoftware = value;
        this.changeCharacterNameSelecter(value);
    }

    /** @type {CharacterName}*/ _selectedCharacterName;

    get selectedCharacterName() {
        return this._selectedCharacterName;
    }

    /**
     * @param {CharacterName} characterName
     */
    set onSelectedCharacterName(characterName) {
        this._selectedCharacterName = characterName;
        this.OnCharacterNameChanged(characterName)
    }

    /** @type {Array<(CharacterName)=>void>} */ onCharacterNameChanged;

    /**
     * @param {CharacterName} characterName
     **/
    OnCharacterNameChanged(characterName) {
        for (const onCharacterNameChanged of this.onCharacterNameChanged) {
            onCharacterNameChanged(characterName);
        }
    }

    /**
     * @param {(CharacterName) => void} method 
     */
    addOnCharacterNameChanged(method) {
        this.onCharacterNameChanged.push(method);
    }

    /**
     * @returns {string}
     */
    get HTMLInput(){
        return `
        <div class="CompositeCharacterNameSelecter"></div>
        `;   
    }

    /**
     * @param {Record<TTSSoftware,CharacterName[]>} characterNamesDict
     * @param {TTSSoftware} defaultTTSSoftWare
     */
    constructor(characterNamesDict, defaultTTSSoftWare) {
        this.baseComponent = new BaseComponent(this.HTMLInput);
        this.characterNamesDict = characterNamesDict;
        this.characterNameSelecterDict = {
            "AIVoice": new CharacterNameSelecter(TTSSoftwareEnum.AIVoice, characterNamesDict[TTSSoftwareEnum.AIVoice]),
            "CevioAI": new CharacterNameSelecter(TTSSoftwareEnum.CevioAI, characterNamesDict[TTSSoftwareEnum.CevioAI]),
            "VoiceVox": new CharacterNameSelecter(TTSSoftwareEnum.VoiceVox, characterNamesDict[TTSSoftwareEnum.VoiceVox]),
            "Coeiroink": new CharacterNameSelecter(TTSSoftwareEnum.Coeiroink, characterNamesDict[TTSSoftwareEnum.Coeiroink]),
        };
        this.selectedSoftware = defaultTTSSoftWare;
    }

    /**
     * 各CharacterNameSelecterをこのコンポーネントの子要素として追加する
     */
    setGraph() {
        this.baseComponent.createArrowBetweenComponents(this.baseComponent, this.characterNameSelecterDict[TTSSoftwareEnum.AIVoice].component);
        this.baseComponent.createArrowBetweenComponents(this.baseComponent, this.characterNameSelecterDict[TTSSoftwareEnum.CevioAI].component);
        this.baseComponent.createArrowBetweenComponents(this.baseComponent, this.characterNameSelecterDict[TTSSoftwareEnum.VoiceVox].component);
        this.baseComponent.createArrowBetweenComponents(this.baseComponent, this.characterNameSelecterDict[TTSSoftwareEnum.Coeiroink].component);
    }

    /**
     * 選択したTTSソフトウェアによって表示するCharacterNameSelecterのエレメントを変更する。1種類しか表示されないようにする。
     * @param {TTSSoftware} ttsSoftware 
     */
    changeCharacterNameSelecter(ttsSoftware) {
        for (const [software, characterNameSelecter] of Object.entries(this.characterNameSelecterDict)) {
            if (software === ttsSoftware) {
                characterNameSelecter.show();
            } else {
                characterNameSelecter.hide();
            }
        }
    }
    
}

class HumanImageSelecter {
    /** @type {BaseComponent} */
    component;
    /** @type {HumanImage[]} */
    humanImages;
    /** @type {HumanImage} */
    selectedHumanImage;

    constructor(humanImages) {
        this.humanImages = humanImages;
        this.selectedHumanImage = humanImages[0];
        const HTMLElementInput = ElementCreater.createSelectElement(humanImages.map(humanImage => humanImage.folder_name), this.calcBoxSize());
        HTMLElementInput.addEventListener('change', (event) => {
            // @ts-ignore
            this.selectedHumanImage = new HumanImage(event.target.value);
            console.log(this.selectedHumanImage);
        });
        this.component = new BaseComponent(HTMLElementInput);
    }
    
    calcBoxSize() {
        return 8;
    }
}

class CompositeHumanImageSelecter {
    /** @type {BaseComponent} */
    component;
    /** @type {Record<CharacterName["name"],HumanImage[]>} */
    humanImagesDict;
    /** @type {Record<CharacterName["name"],HumanImageSelecter>} */
    humanImageSelecter;

    /** @type {CharacterName} */ selectedCharacterName;



    /**
     * @param {Record<CharacterName["name"],HumanImage[]>} humanImagesDict
     * @param {CharacterName} defaultCharacterName
     * @param {HumanImage} defaultHumanImage
     **/
    constructor(humanImagesDict, defaultCharacterName, defaultHumanImage) {
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

    /**
     * @returns {string}
     * */
    get HTMLInput(){
        return `
        <div class="CompositeHumanImageSelecter"></div>
        `;
    }

    /**
     * 各HumanImageSelecterをこのコンポーネントの子要素として追加する
     * */
    setGraph() {
        for (const [characterName, humanImageSelecter] of Object.entries(this.humanImageSelecter)) {
            this.component.createArrowBetweenComponents(this.component, humanImageSelecter.component);
        }
    }

    
}


class CharaSelectFunction{
    /**
     * キャラセレクト機能を表示する
     * 要素は以下のようになる
     * 1. TTSSoftwareを選ぶボタンリスト
     * 2. キャラ名を選ぶボタンリスト
     * 3. 画像を選ぶボタンリスト
     * 
     * そして1の状態によって２が変わり、２の状態によって３が変わるというようにする。
     * 全て最初から表示されている。
     */

    /** @type {BaseComponent} */
    Component;

    /** @type {TTSSoftwareSelecter} */ ttsSoftwareSelecter;
    /** @type {CompositeCharacterNameSelecter} */ compositeCharacterNameSelecter;
    /** @type {CompositeHumanImageSelecter} */ compositehumanImageSelecter;

    /**
     * @returns {TTSSoftware}
     * @throws {Error}
     * */
    get defaultTTSSoftWare() {
        const defaultCharacterName = this.defaultCharacterName;
        //なのでこれが存在しているかセレクターを探す 
        
        //存在していない場合はエラーを返す。画像辞書にはあるのにキャラ名がないのは明らかにおかしい。
        throw new Error("No TTSSoftware");
    }

    /**
     * @returns {CharacterName}
     * @throws {Error}
     */
    get defaultCharacterName() {
        for (const [name, humanImageSelecter] of Object.entries(this.humanImageSelecter)) {
            if (humanImageSelecter.humanImages.length > 0) {
                return new CharacterName(name);
            }
        }
        throw new Error("No characterName");
    }

    /**
     * @returns {HumanImageSelecter}
     * @throws {Error}
     * */
    get defaultHumanImageSelecter() {
        //humanImageSelecterで存在しているものを返さないといけない。何のキーが存在しているかは分からない
        return this.humanImageSelecter[this.defaultCharacterName.name];
    }
    
    /**
     * @param {Record<TTSSoftware,CharacterName[]>} characterNamesDict
     * @param {Record<CharacterName["name"],HumanImage[]>} humanImagesDict
     */
    constructor(characterNamesDict, humanImagesDict) {
        this.ttsSoftwareSelecter = new TTSSoftwareSelecter();
        this.compositeCharacterNameSelecter = new CompositeCharacterNameSelecter(characterNamesDict, this.defaultTTSSoftWare);
        this.compositehumanImageSelecter = new CompositeHumanImageSelecter(humanImagesDict);
        this.humanImageSelecter = {};
        Object.entries(humanImagesDict).forEach(([characterName, humanImages]) => {
            this.humanImageSelecter[characterName] = new HumanImageSelecter(humanImages);
        });

        const componentDefString = this.componentDefString();

        this.Component = new BaseComponent(componentDefString);
        this.initSetChaildElement();
        
        
    }
    componentDefString() {
        return `
        <div class="CharaSelectFunction">
            <div class="TTSSoftwareSelecter"></div>
            <div class="CharacterNameSelecter"></div>
            <div class="HumanImageSelecter"></div>
        </div>
        `;
    }

    initSetChaildElement() {
        this.Component.createChildComponentCluster();
        if (this.Component.childCompositeCluster === null) throw new Error("childCompositeCluster is null");
        // TTSSoftwareSelecterを追加
        this.Component.childCompositeCluster.createArrowBetweenComponents(this.Component, this.ttsSoftwareSelecter.component)
        // CompositeCharacterNameSelecterを追加
        this.Component.childCompositeCluster.createArrowBetweenComponents(this.Component, this.compositeCharacterNameSelecter.component)
        // HumanImageSelecterを追加
        this.Component.childCompositeCluster.createArrowBetweenComponents(this.Component, this.defaultHumanImageSelecter.component)
    }

    /**
     * コンポーネントのふるまいを定義する
     * TTSSoftwareSelecterの選択肢が変更されたときは、CharacterNameSelecterとHumanImageSelecterを変更する。
     * CharacterNameSelecterの選択肢が変更されたときは、HumanImageSelecterを変こうする。
     */
    definitionBehavior() {
        this.ttsSoftwareSelecter.addOnSelectedSoftwareChanged(this.compositeCharacterNameSelecter.changeCharacterNameSelecter)
        this.compositeCharacterNameSelecter.addOnCharacterNameChanged(this.humanImageSelecter.changedHumanImageSelecter)
    }

}


// export { 
//     CharacterName, 
//     NickName, 
//     VoiceMode, 
//     HumanImage, 
//     TTSSoftwareEnum, 
//     TTSSoftwareSelecter,
//     CharacterNameSelecter, 
//     HumanImageSelecter, 
//     CharaSelectFunction,

// };