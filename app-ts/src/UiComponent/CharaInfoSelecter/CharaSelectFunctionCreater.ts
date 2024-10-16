import { TTSSoftware, CharacterName, HumanImage, VoiceMode } from "../../ValueObject/Character";
import { CharaSelectFunction } from "./CharaInfoSelecter";

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
    characterNamesDict: Record<TTSSoftware, CharacterName[]>;
    humanImagesDict: Map<CharacterName, HumanImage[]>;
    voiceModesDict: Map<CharacterName, VoiceMode[]>;

    get apiURLTest() {
        return this.rootURL + "AllCharaInfoTest";
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
        
        // this.requestCharaInfo().then(() => {
        //     this.createCharaSelectFunction();
        // });
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

    async requestCharaInfo() {
        // 1. キャラクター情報をapiにリクエストする

        /**
         * characterNamesDict: Record<TTSSoftware, CharacterName[]>
         * humanImagesDict: Map<CharacterName, HumanImage[]>
         * voiceModesDict: Map<CharacterName, VoiceMode[]>
         * にキャラクター情報を格納する.
         * 3つの情報を非同期に同時に取得する.
         */
        const charaNamesPromise = fetch(this.apiURLCharaNames, this.requestinit)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                this.characterNamesDict = json;
            });
        const humanImagesPromise = fetch(this.apiURLHumanImages, this.requestinit)
            .then(response => response.json())
            .then(json => {
                console.log(json);  
                this.humanImagesDict = json;
            });
        const voiceModesPromise = fetch(this.apiURLVoiceModes, this.requestinit)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                this.voiceModesDict = json;
            });

        await Promise.all([charaNamesPromise, humanImagesPromise, voiceModesPromise]);
    }

    createCharaSelectFunction() {
        const charaSelectFunction = new CharaSelectFunction(
            this.characterNamesDict,
            this.humanImagesDict,
            this.voiceModesDict
        );
    }
}