import { TTSSoftware, CharacterName, HumanImage, VoiceMode, AllHumanInformationDict } from "../../ValueObject/Character";
import { CharaSelectFunction } from "./CharaInfoSelecter";
import { IAllHumanInformationDict } from "./ICharacterInfo";

import "./CharaInfoSelecter.css";
import { HumanTab } from "../HumanDisplay/HumanWindow";
import { CharaModeChangeFunction } from "./CharaModeSelecter";
import { VoMap } from "../../Extend/extend_collections";

interface CharaInfoResponse {
    characterNamesDict: Record<TTSSoftware, CharacterName[]>;
    humanImagesDict: Map<CharacterName, HumanImage[]>;
    voiceModesDict: Map<CharacterName, VoiceMode[]>;
}


export class CharaSelectFunctionCreater {
    /**
     * キャラクター選択関数を作成する
     * 手順
     * 1. キャラクター情報をapiにリクエストする
     * 2. キャラクター情報を取得する
     * 3. 作成する
     */

    rootURL = "http://localhost:8010/";
    requestinit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    allHumanInformationDict: AllHumanInformationDict;
    characterNamesDict: Record<TTSSoftware, CharacterName[]>;
    humanImagesDict: VoMap<CharacterName, HumanImage[]>;
    voiceModesDict: VoMap<CharacterName, VoiceMode[]>;
    humanTab: HumanTab;

    get apiURLTest() {
        return this.rootURL + "AllCharaInfoTest";
    }

    get apiURLCharaInfo() {
        return this.rootURL + "AllCharaInfo";
    }

    constructor(humanTab: HumanTab) {
        this.humanTab = humanTab;
    }

    async requestCharaInfoTest() {
        const testPromise = fetch(this.apiURLTest, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
        });
        await testPromise;
    }

    async fetchHumanInformation(): Promise<IAllHumanInformationDict> {
        const response = await fetch("http://localhost:8010/AllCharaInfo", this.requestinit);
        if (!response.ok) {
            throw new Error("Failed to fetch human information");
        }
        const data: IAllHumanInformationDict = await response.json();
        return data;
    }

    async requestAllCharaInfoTest() {
        const charaInfo = await fetch("http://localhost:8010/AllCharaInfo", this.requestinit)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            return json;
        })
        await charaInfo;
    }

    async requestAllCharaInfo(): Promise<void> {
        var data = await this.fetchHumanInformation();
        console.log(data);
        this.allHumanInformationDict = new AllHumanInformationDict(data);
        this.characterNamesDict = this.allHumanInformationDict.getCharacterNamesDict();
        this.humanImagesDict = this.allHumanInformationDict.getHumanImagesDict();
        this.voiceModesDict = this.allHumanInformationDict.getVoiceModesDict();
    }

    createCharaSelectFunction(): CharaSelectFunction {
        const charaSelectFunction = new CharaSelectFunction(
            this.characterNamesDict,
            this.humanImagesDict,
            this.voiceModesDict,
            this.humanTab
        );
        return charaSelectFunction;
    }

    createCharaModeChangeFunction(tts_software: TTSSoftware, chara_name: CharacterName ): CharaModeChangeFunction {
        const charaModeChangeFunction = new CharaModeChangeFunction(
            tts_software,
            chara_name,
            this.characterNamesDict,
            this.humanImagesDict,
            this.voiceModesDict,
            this.humanTab
        );
        return charaModeChangeFunction;
    }

    static async init(element: HTMLElement, humanTab: HumanTab) {
        const charaSelectFunctionCreater = new CharaSelectFunctionCreater(humanTab);
        await charaSelectFunctionCreater.requestAllCharaInfo();
        if (charaSelectFunctionCreater.humanTab.characterModeState) {
            const charaSelectFunction = charaSelectFunctionCreater.createCharaModeChangeFunction(
                charaSelectFunctionCreater.humanTab.characterModeState.tts_software,
                charaSelectFunctionCreater.humanTab.characterModeState.character_name
            );
            charaSelectFunction.component.bindParentElement(element);
        } else {
            const charaSelectFunction = charaSelectFunctionCreater.createCharaSelectFunction();
            charaSelectFunction.component.bindParentElement(element);
        }
    }
}