import { TTSSoftware, CharacterName, HumanImage, VoiceMode, AllHumanInformationDict } from "../../ValueObject/Character";
import { CharaSelectFunction } from "./CharaInfoSelecter";
import { IAllHumanInformationDict } from "./ICharacterInfo";

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
    apiEndPoints = {
        "CharaNames":"AllCharaInfoCharaNames",
        "HumanImages":"AllCharaInfoHumanImages",
        "VoiceModes":"AllCharaInfoVoiceModes"
    }
    requestinit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    allHumanInformationDict: AllHumanInformationDict;
    characterNamesDict: Record<TTSSoftware, CharacterName[]>;
    humanImagesDict: Map<CharacterName, HumanImage[]>;
    voiceModesDict: Map<CharacterName, VoiceMode[]>;

    get apiURLTest() {
        return this.rootURL + "AllCharaInfoTest";
    }

    get apiURLCharaInfo() {
        return this.rootURL + "AllCharaInfo";
    }

    get apiURLCharaNames() {
        return this.rootURL + this.apiEndPoints.CharaNames;
    }
    get apiURLHumanImages() {
        return this.rootURL + this.apiEndPoints.HumanImages;
    }
    get apiURLVoiceModes() {
        return this.rootURL + this.apiEndPoints.VoiceModes;
    }

    constructor() {
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

    async requestAllCharaInfo() {
        const charaInfo = await fetch("http://localhost:8010/AllCharaInfo", this.requestinit)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            return json;
        })
        await charaInfo;
    }

    async requestCharaInfo() {
        var data = await this.fetchHumanInformation();
        console.log(data);
        this.allHumanInformationDict = new AllHumanInformationDict(data);
        this.characterNamesDict = this.allHumanInformationDict.getCharacterNamesDict();
        this.humanImagesDict = this.allHumanInformationDict.getHumanImagesDict();
        this.voiceModesDict = this.allHumanInformationDict.getVoiceModesDict();
    }

    createCharaSelectFunction() {
        const charaSelectFunction = new CharaSelectFunction(
            this.characterNamesDict,
            this.humanImagesDict,
            this.voiceModesDict
        );
    }
}