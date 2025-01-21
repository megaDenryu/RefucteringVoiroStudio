import "../../../src/OldJs/css/CustomFont.css"
import "../../../src/OldJs/css/setting.css"
import "../../../src/OldJs/css/style.css"
import "../../../src/OldJs/css/voiro_AI_setting.css"

import { SpeechRecognition, SpeechRecognitionEvent, webkitSpeechRecognition } from "../../../src/Extend/webkitSpeechRecognition"; 
import { ExtendedWebSocket } from "../../Extend/extend";
import { ExtendedMap } from "../../Extend/extend_collections";
import { BodyUnitKey, BodyUnitValue, BodyUnitVariationImageInfo, BodyUnitVariationImages, BodyUnitVariationImagesMap, BodyUnitVariationKey, CharaCreateData, convertBodyUnitVariationImagesToMap, HumanBodyCanvasCssStylePosAndSize, HumanData, InitImageInfo, PoseInfo, PoseInfoKey, PoseInfoMap } from "../../ValueObject/IHumanPart";
import { ElementCreater } from "../../UiComponent/Base/ui_component_base";
import { RequestAPI } from "../../Web/RequestApi";
import { HumanTab } from "../../UiComponent/HumanDisplay/HumanWindow";
import { ZIndexManager } from "./ZIndexManager";
import { MessageDict, SendData } from "../../ValueObject/DataSend";
import { IHumanTab } from "../../UiComponent/HumanDisplay/IHumanWindow";
import { CharacterId, CharacterModeState, NickName } from "../../ValueObject/Character";
import { CevioAIVoiceSetting, createCevioAIVoiceSetting } from "../CharacterSetting/CevioAIVoiceSetting";
import { IOpenCloseWindow } from "../../UiComponent/Board/IOpenCloseWindow";
import { createCharacterVoiceSetting } from "../CharacterSetting/CharacterSettingCreater";
import { ICharacterModeState } from "../../UiComponent/CharaInfoSelecter/ICharacterInfo";

// const { promises } = require("fs");


export function addClickEvent2Tab(human_tab_elm: HTMLElement):MessageBox {
    // タブに対してクリックイベントを適用
    // タブ識別用にdata属性を追加
    const num:Number = GlobalState.message_box_manager.message_box_list.length;
    human_tab_elm.setAttribute('data-tab_num', num.toString());
    //メッセージボックスのサイズが変更された時のイベントを追加
    var message_box_elm = human_tab_elm.getElementsByClassName("messageText")[0] as HTMLTextAreaElement;
    return new MessageBox(message_box_elm,GlobalState.message_box_manager,num,human_tab_elm);
}

export class VoiceRecognitioManager {
    private static instance:VoiceRecognitioManager|null = null;
    public user_number: number;
    public recognition: SpeechRecognition;

    constructor(){
        //音声認識
        this.user_number = 0;
        this.recognition = new webkitSpeechRecognition();
        this.recognition.lang = 'ja-JP';  // 言語を日本語に設定
        this.recognition.onresult = this.convertToHiragana;  // 結果が返ってきたらconvertToHiraganaを実行
        this.restartEventOnEnd()
        /*this.recognition.onend = () => {
            this.recognition.start();  // 音声認識が終了したときに再開する
        };*/
    }

    static singlton(): VoiceRecognitioManager {
        if(VoiceRecognitioManager.instance == null){
            VoiceRecognitioManager.instance = new VoiceRecognitioManager();
        }
        return VoiceRecognitioManager.instance!;
    }

    start(){
        this.restartEventOnEnd();
        this.recognition.start();  // 音声認識を開始
        console.log("音声認識を開始");
    }

    stop(){
        this.recognition.stop();  // 音声認識を停止
    }

    deleteEventOnEnd(){
        this.recognition.onend = () => {
            console.log("音声認識を停止");
        };
    }
    restartEventOnEnd(){
        this.recognition.onend = () => {
            this.recognition.start();  // 音声認識が終了したときに再開する
            let now = new Date();
            console.log("音声認識を再開", "現在時刻:", now.toISOString());
        };
    }

    

    convertToHiragana(event: SpeechRecognitionEvent): void {
        console.log("音声認識イベント発生");
        const text = event.results[0][0].transcript;  // 音声認識の結果を取得
        // 音声認識の結果をひらがなに変換するAPIにリクエストを送る
        const speak_debug = true;
        if (speak_debug && 1 == VoiceRecognitioManager.singlton().user_number){
            let now = new Date();
            console.log("音声認識結果を表示", "現在時刻:", now.toISOString(),text);
            //user_char_nameのmessage_boxを取得
            GlobalState.message_box_manager.userMessageBox?.sendMessage(text);
        }
    }
}


export class MessageBoxManager {

    /**  メッセージボックスのリスト*/ 
    message_box_list: MessageBox[]

    /** メッセージボックスの辞書。キーはキャラのCharacterId、値はメッセージボックスのインスタンス。*/
    message_box_dict: ExtendedMap<CharacterId, MessageBox>

    /** 監視しているメッセージボックスの番号を格納。-1なら監視していない。*/
    observe_target_num: number

    /** 監視対象のメッセージボックスの高さが変更されたときに、他のメッセージボックスの高さも変更するためのオブジェクト。*/
    resizeObserver: ResizeObserver

    /** キャラのgptモードの状態を格納する辞書。キーはキャラのCharacterId、値はgptモードの状態。*/
    Map_all_char_gpt_mode_status : ExtendedMap<CharacterId, string>

    get humanTabList(): HumanTab[] {
        return this.message_box_list.map((message_box) => message_box.human_tab);
    }

    get humanTabDict(): Record<CharacterId, HumanTab> {
        const dict = {};
        for (let message_box of this.message_box_list) {
            if (message_box.human_tab.characterId == null) {continue;}
            dict[message_box.human_tab.characterId] = message_box.human_tab;
        }
        return dict;
    }

    get userMessageBox():MessageBox|null {
        for (let message_box of this.message_box_list) {
            if (message_box.human_tab.micToggleButton.mode == "user") {
                return message_box;
            }
        }
        return null;
    }

    constructor() {
        this.message_box_list = [];
        this.message_box_dict = new ExtendedMap();
        this.observe_target_num = -1;
        this.resizeObserver = new ResizeObserver((entries) => {
            this.setHeight((entries[0].target as HTMLElement).style.height, this);
        });
        this.Map_all_char_gpt_mode_status = new ExtendedMap();
    }

    setMessageBox(message_box:MessageBox):number {
        this.message_box_list.push(message_box);
        var assign_number = this.message_box_list.length - 1;
        return assign_number;
    }

    //１つのメッセージボックスの大きさが変更されたときに、他のメッセージボックスの大きさも変更する関数
    setHeight(height: string, changed_message_box:MessageBoxManager) {
        var self = this;
        //他のmessage_boxの高さも変更する
        console.log("message_box_list=",this.message_box_list);
        for (let i=0;i<this.message_box_list.length;i++){
            if (this.observe_target_num != i){
                this.message_box_list[i].message_box_elm.style.height = height;
            }
        }

    }

    /**
     * キャラのIdとメッセージボックスを紐づける
     */
    linkCharaIdAndNum(characterId:CharacterId ,tab_num:number) {
        const message_box = this.message_box_list[tab_num];
        this.message_box_dict.set(characterId,message_box);
        message_box.setGptMode("off");
        const gpt_mode_name_list = ["off","individual_process0501dev"];
        message_box.gpt_setting_button_manager_model = new GPTSettingButtonManagerModel(characterId, message_box, gpt_mode_name_list)
    }

    
    setGptMode2AllStatus(characterId:CharacterId,gpt_mode:string) {
        this.Map_all_char_gpt_mode_status.set(characterId, gpt_mode);
    }

    getAllGptModeByDict(): Record<string, string> {
        const gpt_mode_dict = {};
        for (let [key, value] of this.Map_all_char_gpt_mode_status) {
            gpt_mode_dict[key] = value;
        }
        return gpt_mode_dict;
    }


    getMessageBoxByFrontName(front_name:string):MessageBox|null {
        //front_nameがfront2chara_nameにない場合はnullを返す
        if (front_name in GlobalState.front2chara_name) {
            return this.message_box_dict.get(front_name);
        } else {
            return null;
        }
    }

    getMessageBoxByCharName(char_name:string):MessageBox|undefined {
        const front_name = chara_name2front_name(char_name);
        if (front_name == "no_front_name") {
            return undefined;
        }
        return this.message_box_dict.get(front_name);
    }

}


export class MessageBox {
    //message_box単体のクラス
    public char_name: string;
    public gpt_mode: string;
    public message_box_elm: HTMLTextAreaElement;
    public parent_ELM_input_area: HTMLElement|null
    public ELM_send_button: HTMLElement;
    public ELM_voice_setting_button: HTMLElement;
    public message_box_manager: MessageBoxManager;
    public manage_num: number;
    public ws_nikonama_comment_reciver: WebSocket;
    public ws_youtube_comment_reciver: ExtendedWebSocket;
    public ws_twitch_comment_reciver: ExtendedWebSocket;
    private _characterVoiceSetting: IOpenCloseWindow|null = null;
    gpt_setting_button_manager_model: GPTSettingButtonManagerModel;
    human_tab: HumanTab;

    get front_name(): string|null {
        if (this.human_tab.humanName.nick_name == null) {
            return null;
        }
        return this.human_tab.humanName.nick_name.name;
    }
    
   
    constructor(message_box_elm:HTMLTextAreaElement, message_box_manager:MessageBoxManager, manage_num:Number, human_tab_elm:HTMLElement) {
        this.char_name = "";
        this.gpt_mode = "";
        this.message_box_elm = message_box_elm;
        this.parent_ELM_input_area = this.message_box_elm.closest(".input_area");
        this.ELM_send_button = this.parent_ELM_input_area?.getElementsByClassName("send_button")[0] as HTMLElement;
        this.ELM_voice_setting_button = this.parent_ELM_input_area?.getElementsByClassName("voice_setting_button")[0] as HTMLElement;
        this.message_box_manager = message_box_manager;
        this.human_tab = new HumanTab(human_tab_elm);
        //メッセージボックスマネージャーにこのメッセージボックスを登録
        this.manage_num = this.message_box_manager.setMessageBox(this);
        if(manage_num != this.manage_num) {
            alert("message_box_managerに登録された番号と、message_boxの番号が一致しません。")
        }
        //メッセージボックスの高さが変更されたときに、他のメッセージボックスの高さも変更するようにする
        this.message_box_elm.addEventListener('mousedown', this.startObsereve.bind(this));
        this.message_box_elm.addEventListener('mouseup', this.endObsereve.bind(this));
        this.ELM_voice_setting_button.onclick = (event) => {
            // todo ここに音声設定ウインドウを表示する処理を書く
            if (this._characterVoiceSetting == null) {
                // this._characterVoiceSetting = createCevioAIVoiceSetting(this.human_tab.characterId);
                const characterId = this.human_tab.characterId;
                const tts_software = this.human_tab.characterModeState?.tts_software;
                if (tts_software == null) {return;}
                this._characterVoiceSetting = createCharacterVoiceSetting(characterId, tts_software);
            }

            if (this._characterVoiceSetting == null) {return;}

            if (this._characterVoiceSetting.isOpen()) {
                this._characterVoiceSetting.close();
            } else {
                this._characterVoiceSetting.open();
            }
        }
        
        this.ELM_send_button.onclick = async (event) => {
            await this.execContentInputMessage();
        };
        this.execContentInputMessage = this.execContentInputMessage.bind(this);
    }
    startObsereve():void {
        this.message_box_manager.observe_target_num = this.manage_num;
        this.message_box_manager.resizeObserver.observe(this.message_box_elm);
    }
    endObsereve():void {
        this.message_box_manager.observe_target_num = -1;
        this.message_box_manager.resizeObserver.unobserve(this.message_box_elm);
    }
    async execContentInputMessage() {
        // const front_name = this.front_name;
        const characterId = this.human_tab.characterId;
        const message = this.message_box_elm.value;
        //messageに「コメビュモード:{room_id}」と入力されている場合
        if (message.includes("コメビュモード:")) {
            //コメビュモードに入る
            const room_id = message.split(":")[1];
            //websocketを開く
            this.ws_nikonama_comment_reciver = new WebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/nikonama_comment_reciver/${room_id}/${characterId}`);
            this.ws_nikonama_comment_reciver.onmessage = this.receiveNikoNamaComment.bind(this);
            //メッセージボックスの中身を削除
            this.message_box_elm.value = "";
            //focusを戻す
            this.message_box_elm.focus();
        } else if (message.includes("https://live.nicovideo.jp/watch/")) {
            //コメビュモードに入る
            const room_id = message.split("https://live.nicovideo.jp/watch/")[1];
            //websocketを開く
            this.ws_nikonama_comment_reciver = new WebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/nikonama_comment_reciver/${room_id}/${characterId}`);
            this.ws_nikonama_comment_reciver.onmessage = this.receiveNikoNamaComment.bind(this);
            //メッセージボックスの中身を削除
            this.message_box_elm.value = "";
            //focusを戻す
            this.message_box_elm.focus();
        } else if (message.includes("https://www.youtube.com/watch?v=")) {
            //youtubeのコメントを受信する
            const video_id = message.split("https://www.youtube.com/watch?v=")[1];
            console.log(video_id)
            //websocketを開く
            this.ws_youtube_comment_reciver = new ExtendedWebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/YoutubeCommentReceiver/${video_id}/${characterId}`);
            this.ws_youtube_comment_reciver.onmessage = this.receiveYoutubeLiveComment.bind(this);
            //接続を完了するまで待つ
            this.ws_youtube_comment_reciver.onopen = () => {
                //開始メッセージを送信
                // @ts-ignore
                this.ws_youtube_comment_reciver.sendJson({ "start_stop": "start" });
            }

            //メッセージボックスの中身を削除
            this.message_box_elm.value = "";
            //focusを戻す
            this.message_box_elm.focus();
        } else if (message.includes("ようつべコメント停止:")) {
            console.log("コメント受信停止します")
            if (this.ws_youtube_comment_reciver) {
                console.log("コメント受信停止を送信")
                this.ws_youtube_comment_reciver.sendJson({ "start_stop": "stop" });
            }
        } else if (message.includes("https://www.twitch.tv/")) {
            //twitchのコメントを受信する
            const video_id = message.split("https://www.twitch.tv/")[1];
            console.log(video_id,characterId)
            //Postを送信してRunTwitchCommentReceiverを実行
            await fetch(`http://${GlobalState.localhost}:${GlobalState.port}/RunTwitchCommentReceiver`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ video_id: video_id, characterId: characterId })
            });
            
            await new Promise(resolve => setTimeout(resolve, 3000));

            //websocketを開く
            this.ws_twitch_comment_reciver = new ExtendedWebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/TwitchCommentReceiver/${video_id}/${characterId}`);
            this.ws_twitch_comment_reciver.onmessage = this.receiveNikoNamaComment.bind(this);
            //接続を完了するまで待つ
            this.ws_twitch_comment_reciver.onopen = () => {
                //開始メッセージを送信
                // @ts-ignore
                this.ws_twitch_comment_reciver.sendJson({ "start_stop": "start" });
            }

            //メッセージボックスの中身を削除
            this.message_box_elm.value = "";
            //focusを戻す
            this.message_box_elm.focus();
            
        }
        else if (message.includes("ツイッチコメント停止:")) {
            console.log("コメント受信停止します")
            fetch(`http://${GlobalState.localhost}:${GlobalState.port}/StopTwitchCommentReceiver`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ characterId: characterId })
            }).then(response => {
                console.log(response)
            });
        }
        else if (message.includes("背景オン:") || message.includes("GBmode:") || message.includes("MBmode:") || message.includes("BBmode:")) {
            this.human_tab.changeBackgroundMode(message);
        }
        else {
            //メッセージを送信する
            const message = this.message_box_elm.value;
            this.sendMessage(message)
        }

        //メッセージボックスの中身を削除
        this.message_box_elm.value = "";
        //focusを戻す
        this.message_box_elm.focus();

    }
    receiveNikoNamaComment(event) {
        const message = JSON.parse(event.data);
        const char_name = message["char_name"];
        const comment = message["comment"];
        console.log("char_name=",char_name,"comment=",comment)
        if (char_name == this.char_name) {
            this.sendMessage(comment);
        } else {
            let message_box = GlobalState.message_box_manager.getMessageBoxByCharName(char_name)
            if (message_box == null) {
                this.sendMessage(comment);
            } else {
                message_box.sendMessage(comment);
            }
        }
    }

    receiveYoutubeLiveComment(event) {
        const message = JSON.parse(event.data);
        const char_name:string = message["char_name"];
        const comment:string = message["message"];
        console.log("char_name=",char_name,"comment=",comment)
        if (char_name == this.char_name) {
            this.sendMessage(comment);
        } else {
            let message_box = GlobalState.message_box_manager.getMessageBoxByCharName(char_name)
            if (message_box == null) {
                this.sendMessage(comment);
            } else {
                message_box.sendMessage(comment);
            }
        }
    }

    /**
     * @param {string} gpt_mode 
     */
    setGptMode(gpt_mode:string) {
        this.gpt_mode = gpt_mode;
        this.message_box_manager.setGptMode2AllStatus(this.human_tab.characterId,gpt_mode);
    }

    sendMessage(message:string) {
        //メッセージを送信する
        const message_dict:MessageDict = {}
        if (this.front_name == null) {return;}
        message_dict[this.front_name] = {
            "text": message,
            "characterModeState": this.human_tab.characterModeState?.toDict() ?? null
        };
        const send_data:SendData = {
            "message" : message_dict,
            "gpt_mode" : this.message_box_manager.getAllGptModeByDict()
        }
        let ret = JSON.stringify(send_data);
        console.log("ret")
        console.log(ret)
        GlobalState.ws.send(JSON.stringify(send_data));
    }
}

function getMessageBoxByCharName(char_name) {
    return GlobalState.message_box_manager.message_box_dict.get(char_name);
}

//キャラ名を送信するときのイベント関数
function sendMessage(event: Event) {
    event.preventDefault()
    var human_tabs = document.getElementsByClassName("human_tab")
    let inputs_dict = {}
    for (let i=0;i<human_tabs.length;i++){
        let human_name = human_tabs[i].getFirstHTMLElementByClassName("human_name").innerText
        let input_elem = human_tabs[i].getFirstTextAreaElementByClassName("messageText")
        inputs_dict[human_name] = input_elem.value
        input_elem.value = ""
    }
    let inputs_json = JSON.stringify(inputs_dict)
    GlobalState.ws.send(inputs_json)

    //sendを押したキャラタブのmessageTextにフォーカスを移す。
    let ELM_input_area = (event.target as HTMLElement)?.closest(".input_area")
    let ELM_messageText = ELM_input_area?.getFirstHTMLElementByClassName("messageText")[0]
    ELM_messageText.focus()

    
}

export type AllData = Record<string, Record<string, string>>;





//キャラ名を受信するときのイベント関数
function receiveMessage(event) {
    //ここで行う処理の内容は、apiから受信したキャラ画像を表示する処理
    let no_image_human = document.getElementsByClassName("no_image_human")

    let charaCreateData:CharaCreateData = JSON.parse(JSON.parse(event.data));
    let body_parts:HumanData = charaCreateData.humanData;
    const characterModeState:CharacterModeState = CharacterModeState.fromDict(charaCreateData.characterModeState);
    
    console.log("human_listに追加:"+body_parts["char_name"])
        
    try{
        GlobalState.humans_list[characterModeState.id] = new HumanBodyManager2(body_parts,characterModeState);
    } catch (e) {
        console.log(e)
        console.log("human_listに追加失敗:"+body_parts["char_name"])
    }

    GlobalState.front2chara_name[body_parts["front_name"]] = body_parts["char_name"]
    console.log("front2chara_name=",GlobalState.front2chara_name)

    //CharacterModeStateの登録
    let humanTab:HumanTab = GlobalState.message_box_manager.message_box_dict.get(characterModeState.id)?.human_tab ?? (() => {throw new Error("human_tabが見つかりませんでした。")})();
    humanTab.characterModeState = characterModeState;
    
}

export interface WavInfo {
    path: string; // wavファイルのパス
    wav_data: string; // wavファイルのデータ（Base64形式）
    wav_time: number; // wavファイルの再生時間
    phoneme_time: string; // 音素の開始時間と終了時間の情報
    phoneme_str: string[][]; // 音素の情報
    char_name: string; // キャラの名前
    voice_system_name: string; // 音声合成のシステムの名前
    characterModeState: ICharacterModeState; // キャラのモードの状態
}

export interface SentenceOrWavSendData {
    sentence: Record<string, string>;
    wav_info: WavInfo[];
    chara_type: "gpt" | "player";
}

//gptで生成された会話データを受信したときのイベント関数
export async function receiveConversationData(event) {
    var human_tab = document.getElementsByClassName('human_tab');
    let obj:SentenceOrWavSendData = JSON.parse(JSON.parse(event.data));
    var audio_group = document.getElementsByClassName("audio_group")[0]
    if (obj["chara_type"] == "gpt") {
        //文章を表示
        const sentence:Record<string,string> = obj["sentence"];
        const textPromise = execText(sentence,human_tab)

        //音声を再生
        const wav_info:WavInfo[]  = obj["wav_info"];
        const audioPromise = execAudioList(wav_info,audio_group)

        // 両方の処理が終わるのを待つ
        await Promise.all([textPromise, audioPromise]);

        //gptからの音声だった場合は終了を通知。
        const front_name = getNthKeyFromObject(sentence, 0) //todo : 本当はここでfront_nameではなくCharaIdで識別できるようにしないといけないがこれはサーバーに手を入れないといけない
        const message_box = GlobalState.message_box_manager.getMessageBoxByFrontName(front_name);
        if (message_box) {
            const human_gpt_routine_ws = message_box.gpt_setting_button_manager_model.human_gpt_routine_ws_dict[front_name];
            human_gpt_routine_ws.sendJson({ "gpt_voice_complete": "complete" });
        }
        
    } else if(obj["chara_type"] == "player") {
        //文章を表示
        const sentence:Record<string,string> = obj["sentence"];
        const textPromise = execText(sentence,human_tab)

        //音声を再生
        const wav_info:WavInfo[]  = obj["wav_info"];
        const audioPromise = execAudioList(wav_info,audio_group)

        // 両方の処理が終わるのを待つ
        await Promise.all([textPromise, audioPromise]);
    } else {
        console.error("データ型が不正です。この下の古いパターンを通っている可能性があります。todo: 以下のコメントアウトを削除", obj);
        // if (0 in obj && "wav_data" in obj[0]) {
        //     //wavファイルが送られてきたときの処理。
        //     //複数のwavファイルが送られてくるのでaudio_groupに追加していく。
        //     await execAudioList(obj,audio_group)
        // }
        // else {
        //     await execText(obj,human_tab)
        // }
    }
}

/**
 * //テキストが送られてきたときの処理
 */
async function execText(obj: Record<string,string>, human_tab: HTMLCollectionOf<Element>) {
    console.log(obj)
    for(let i=1; i<human_tab.length;i++){
        //human_tabの中のhuman_nameを取得
        let message = document.createElement('li')
        //human_nameを取得
        let name = human_tab[i].getFirstHTMLElementByClassName("human_name").innerText
        //message_colを取得
        let message_col = human_tab[i].getElementsByClassName("message_col")[0]

        let str = ""
        //messageを作成
        if(obj.hasOwnProperty(name)){
            if(typeof obj[name] == "object"){
                console.log("上を通った")
                for(let key in obj[name] as object){
                    if (key == "感情"){
                        str = `${key}:${JSON.stringify(obj[name][key])}\n\n`
                    }else{
                        str = `${key}:${obj[name][key]}\n\n`
                    }
                    
                    let content = document.createTextNode(str)
                    message.appendChild(content)
                }
            }else{
                console.log("下を通った")
                console.log("obj[name]=",obj[name])
                let content = document.createTextNode(obj[name])
                message.appendChild(content)
            }
            
        
            //class = "subtitle"を取得してinnerTextをmessageに変更
            let subtitle = human_tab[i].getElementsByClassName("subtitle")[0]
            if (subtitle instanceof HTMLElement) {
                updateSubtitle(subtitle, obj[name])
            }
            

            //class = "message"を追加
            message.classList.add("message")
            message_col.appendChild(message)
            
            //mode_integrateのmessage_colにも追加
            let message_col_integrate = document.getElementsByClassName("message_col mode_integrate")[0]
            let message_integrate = message.cloneNode(true) as HTMLElement
            message_integrate.classList.add("message_integrate")
            //message_integrateに番号情報を追加。後で位置の再調整に使う。
            message_integrate.setAttribute("data-tab_num", i.toString())
            //message_integrateの横のmarginに使う値
            const base_margin = 6
            //message_integrateの横位置を調整
            message_integrate.style.marginLeft = `${100 / (human_tab.length-1) * (i-1) + base_margin / (human_tab.length-1)}%`
            //message_integrateのwidthを調整
            message_integrate.style.width = `${100 / (human_tab.length-1) - base_margin / (human_tab.length-1) * 2}%`

            message_col_integrate.appendChild(message_integrate)
            //一番下にスクロール
            message_col.scrollTop = message_col.scrollHeight;
            message_col_integrate.scrollTop = message_col_integrate.scrollHeight;
        }

        
        //humans_list.ONE_chan.changeTail()
    }
}

/**
 * 吹き出しのテキストを更新する。
 * @param {HTMLElement} subtitle
 * @param {string} text
 */
function updateSubtitle(subtitle,text){

    // subtitle.innerText = text;
    // console.log("subtitle.innerText=",subtitle.innerText)
}



async function execAudioList(obj:WavInfo[],audio_group:Element) {
    console.log(obj)

    for await(let item of obj){
        console.log("audio準備開始")
        audio_group = await execAudio(item,audio_group);
        console.log(item["char_name"]+`音源再生終了`)
        // todo ここで待機時間分待機
    }
    console.log("全て再生終了")
}


/**
 * 
 * @param {WavInfo} obj 
 * @param {Element} audio_group 
 * @param {Number} maxAudioElements 
 * @returns 
 */
async function execAudio(obj:WavInfo ,audio_group:Element, maxAudioElements:number = 100):Promise<Element> {
    //wavファイルをバイナリー形式で開き、base64エンコードした文字列を取得
    let wav_binary = obj["wav_data"]
    //wavファイルをbase64エンコードした文字列をaudioタグのsrcに設定
    let lab_data = obj["phoneme_str"];
    if (lab_data.length == 0) {
        console.log("lab_dataが空です")
        return audio_group;
    }
    const voice_system_name = obj["voice_system_name"];
    console.log("lab_data=",lab_data)
    var audio = document.createElement('audio');
    audio.src = `data:audio/wav;base64,${wav_binary}`;
    //audioタグを追加
    audio_group.appendChild(audio);

    // audio_group内のaudioエレメントが上限を超えたら、最初のエレメントを削除
    while (audio_group.childElementCount > maxAudioElements) {
        audio_group.removeChild(audio_group.firstElementChild ?? (() => { throw new Error("audio_groupの子要素が存在しません") })());
    }

    audio.load();
    await new Promise(resolve => audio.onloadedmetadata = resolve);
    //audioの長さを取得
    const time_length = audio.duration * 1000;
    console.log("time_lengthを確認します",[time_length, obj.wav_time*1000])
    //labdataの最後の要素の終了時間を取得
    try{
        var last_end_time = Number(lab_data[lab_data.length-1][2]) * 1000;
    } catch (e) {
        console.log(e)
        console.log("lab_dataのアクセスエラーです")
        return audio_group;
    }
    let ratio = 1;
    if (voice_system_name == "Coeiroink") {
        ratio = time_length / last_end_time;
    }
    console.log(time_length,last_end_time,ratio)

    //audioを再生して口パクもする。
    var lab_pos = 0;
    console.log("audioタグを再生")
    await new Promise((resolve) => {
        audio.onended = resolve;
        audio.play().then(() => {
            let intervalId = setInterval(() => {
                let current_time = audio.currentTime * 1000;
                let start_time = 0;
                let end_time = 100;

                if (lab_pos in lab_data) {
                    start_time = Number(lab_data[lab_pos][1]) * 1000 * ratio;
                    end_time = Number(lab_data[lab_pos][2]) * 1000 * ratio;
                } else {
                    console.error('Invalid lab_pos:', lab_data, "lab_pos="+lab_pos);
                    // ここで適切なエラーハンドリングを行います
                    //audioの再生を止める
                    audio.pause();
                }

                // todo start_timeとend_timeが定義されないまま入ってるときにバグってる可能性がある
                if (start_time <= current_time && current_time <= end_time ) {
                    // console.log("通ってる",obj["char_name"],lab_data[lab_pos][0]);
                    try{
                        GlobalState.humans_list[obj["characterModeState"]["id"]].changeLipImage(obj["characterModeState"]["id"],lab_data[lab_pos][0]);
                    } catch (e) {
                        console.log(e)
                        console.log(("口画像が設定されていない"))
                    }
                    lab_pos += 1;
                }

                if (current_time > end_time) {
                    lab_pos += 1;
                }

                if (lab_pos >= lab_data.length) {
                    //終わったら口パクを終了して口を閉じる
                    try{
                        GlobalState.humans_list[obj["characterModeState"]["id"]].changeLipImage(obj["characterModeState"]["id"],"end");
                    } catch (e) {
                        console.log(e)
                        console.log(("口画像が設定されていない"))
                    }
                    clearInterval(intervalId);
                }

                if (audio.ended) {
                    clearInterval(intervalId);
                }
            }, 10); // 100ミリ秒ごとに更新
        });
    });
    return audio_group;
}

/**
 * グローバルなイベントキューからイベントを取り出して処理する
 * 処理が終わったら再帰的に自身を呼び出す
 * ただし、処理中は次のイベントを処理しない
 **/
async function processMessages() {
    console.log("メッセージからprocessMessages()を呼び出しました、isProcessing=",GlobalState.isProcessing)
    if (GlobalState.isProcessing || GlobalState.messageQueue.length === 0) {
        // 処理中 or キューが空なら何もしない
        console.log("処理中 or キューが空なので何もしない")
        return;
    }
    // 処理を実行するので処理中フラグを立てる
    GlobalState.isProcessing = true;
    // キューからイベントを取り出して処理する
    var new_event = GlobalState.messageQueue.shift();
    await receiveConversationData(new_event);
    GlobalState.isProcessing = false;
    console.log("次のprocessMessages()を呼び出します")
    processMessages();
}            




export function sendHumanName(nick_name:NickName) {
    if (GlobalState.human_ws.readyState !== WebSocket.OPEN) {
        humanWsOpen();
        GlobalState.human_ws.onopen = function(e) {
            GlobalState.human_ws.send(nick_name.name);
        };
    }
    GlobalState.human_ws.send(nick_name.name);
}

function changeMargin(){
    //todo 今は停止中。もっと良さそうな方法があれば使う。

    //Partyマージンを変更
    let Party = document.getElementsByClassName("Party")[0] as HTMLElement
    let human_tabs = Party.getElementsByClassName("human_tab")
    const margin = 25 / (human_tabs.length-1)
    Party.style.marginLeft = `${margin}%`;
    Party.style.marginRight = `${margin}%`;
    //もしclass = "message"があるならそのwidthをtab数に応じて変更
    let messages = document.getElementsByClassName("message") as HTMLCollectionOf<HTMLElement>
    for (let i=0;i<messages.length;i++){
        messages[i].style.width = `${95-human_tabs.length*2.5}%`
    }
    
    
}

//体パーツの画像をクリックして、画像を変更する処理を実装する
//body_partsの画像をクリックしたときの処理
function changeBodyParts(button){

}

/** 現状使わないが、canvasの勉強のため残す*/
function canvas_process(human_tab){
    //canvasの処理
    console.log("canvasの処理開始")
    var canvas = human_tab.getElementsByClassName('canvas')[0];
    //canvasを枠の大きさに合わせる
    const human_elem = human_tab.getElementsByClassName("human")[0] 
    canvas.width = human_elem.offsetWidth;
    canvas.height = human_elem.offsetHeight;
    //canvas.style.background = "red";
    //canvasにbg_imageを描画
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = "./images/その他画像/nc268704.jpg";
    //位置を真ん中にし、画像の比率はそのままに枠に合わせる
    img.onload = function(){
        ctx.drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.height);
    }

    //var ctx = canvas.getC
    console.log("canvasの処理終了")
}


class DragDropObjectStatus{
    human_images_elem: Element;
    humanBodyManager: HumanBodyManager2;
    bg_image: Element;
    human_window: Element;
    human_image_elems: HTMLCollectionOf<HTMLElement>;
    search_canvas_elem: HTMLElement;
    mouse_down: boolean;
    mouse_down_pos_x: number;
    mouse_down_pos_y: number;
    img_scale: number;
    canvas_offsetLeft: number;
    canvas_offsetTop: number;
    
    constructor(human_images_elem: Element,humanBodyManager:HumanBodyManager2){
        //プロパティには各画像の状態などを格納する
        this.human_images_elem = human_images_elem;
        this.humanBodyManager = humanBodyManager;
        this.bg_image = (human_images_elem.parentNode as Element).getElementsByClassName("bg_image")[0]
        this.human_window = (human_images_elem.parentNode as Element)
        this.human_image_elems = human_images_elem.getElementsByClassName("human_image") as HTMLCollectionOf<HTMLElement>;
        this.search_canvas_elem = (human_images_elem.parentNode as Element).getElementsByClassName("search_canvas")[0] as HTMLElement;
        this.mouse_down = false;
        this.mouse_down_pos_x = 0;
        this.mouse_down_pos_y = 0;
        this.img_scale = 1;

        let oprator_canvas = this.human_images_elem.getElementsByClassName("operator_canvas")[0] as HTMLElement;
        oprator_canvas.dataset.scale = this.img_scale.toString();
    }
    handleEvent(event: Event){
        switch(event.type){
            case "mousedown":
                this.mouseDown(event as MouseEvent);
                break;
            case "mouseup":
                this.mouseUp(event);
                break;
            case "mousemove":
                this.mouseMove(event);
                break;
            case "wheel":
                this.mouseWheel(event as WheelEvent);
                break;
        }
    }
    
    mouseDown(e:MouseEvent){
        //クラス名に .drag を追加
        (e.target as Element).classList.add("drag");
        //タッチデイベントとマウスのイベントの差異を吸収
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e;//.changedTouches[0];
        }

        //要素内でのマウスをクリックした場所の相対座標を取得。
        this.mouse_down_pos_x = event.pageX;
        this.mouse_down_pos_y = event.pageY;
        let target = e.target as HTMLElement;
        this.canvas_offsetLeft = target?.offsetLeft;
        this.canvas_offsetTop = target?.offsetTop;
        //console.log("mouse_down_pos_x="+[this.mouse_down_pos_x,event.pageX,e.target.offsetLeft])
        //console.log("mouse_down_pos_y="+[this.mouse_down_pos_y,event.pageY,e.target.offsetTop])

        //右クリックなら点を描画
        if (event.button == 2){
            console.log("右クリック")
            let parent = target.parentNode as HTMLElement;
            var oprator_canvas = parent?.getElementsByClassName("operator_canvas")[0]
            var canvas_rect = oprator_canvas.getBoundingClientRect()
            var x_on_canvas = e.pageX - canvas_rect.left;
            var y_on_canvas = e.pageY - canvas_rect.top;
            console.log("canvas_rect.left,canvas_rect.top="+[canvas_rect.left,canvas_rect.top])
            drawFillRectInOpratorCanvas(
                x_on_canvas / this.img_scale,
                y_on_canvas / this.img_scale,
                10,10,"green"
                )
        }
        
    }

    
    mouseMove(e : Event) {
        //ドラッグしている要素を取得
        //e.targetのクラスネームにdragがあるかどうかで処理を分岐させる
        if ((e.target as HTMLElement)?.classList.contains("drag")){
            let drag = e.target;
            //同様にマウスとタッチの差異を吸収
            let ev;
            if(e.type === "mousemove") {
                ev = e;
            } else {
                ev = (e as TouchEvent).changedTouches[0];
            }

            //フリックしたときに画面を動かさないようにデフォルト動作を抑制
            e.preventDefault();
            //マウスが動いた場所に要素を動かす
            for (let i=0;i<this.human_image_elems.length;i++){
                (this.human_image_elems[i] as HTMLElement).style.left = addPixelValues(this.canvas_offsetLeft.toString(), ev.pageX - this.mouse_down_pos_x + "px");
                (this.human_image_elems[i] as HTMLElement).style.top = addPixelValues(this.canvas_offsetTop.toString(), ev.pageY - this.mouse_down_pos_y + "px");
            }
        }
    }

    //マウスボタンが上がったら発火
    mouseUp(e) {
        console.log("mouseUp")
        if (e.target.classList.contains("drag")){
            var drag = e.target;

            //クラス名 .drag も消す
            drag.classList.remove("drag");
        }
    }
    //ホイールイベント:画像の拡大縮小
    mouseWheel(e: WheelEvent){
        if ((e.target as Element).classList.contains("drag")){
            //ホイールの回転量を取得
            var wheel = e.deltaY;
            //ホイールの回転量に応じて画像の拡大縮小
            var delta_ratio = 0;
            if(wheel > 0){
                delta_ratio = -0.1;
            }else{
                delta_ratio = 0.1;
            }
            this.img_scale = this.img_scale + delta_ratio
            //opratpr_canvasのdata属性にscaleを保存
            var oprator_canvas = this.human_images_elem.getElementsByClassName("operator_canvas")[0] as HTMLElement;
            oprator_canvas.dataset.scale = this.img_scale.toString();

            //console.log("img_scale:"+this.img_scale);
            //全ての画像のサイズは同じなので拡大縮小をする
            var height = 65 * this.img_scale;
            //console.log(`${height}vh`);
            //console.log(this.human_image_elems[0].style.height);
            //拡大縮小の中心を、クリックしたときの座標のbg_imageからの相対座標として、画像のtop,leftを変更する

            //背景画像の左上角の位置を取得。しかしGBmodeでは画像が消滅してうまく取得できてない可能性がある
            // var bg_image_rect = this.bg_image.getBoundingClientRect()
            let human_window_rect = this.human_window.getBoundingClientRect()
            //マウスの絶対位置から背景画像の左上角の位置を引くことで、背景画像に対するマウスの相対位置を計算
            let P_x = e.pageX - human_window_rect.left;
            let P_y = e.pageY - human_window_rect.top;
            let t = this.img_scale / (this.img_scale - delta_ratio)
            let old_top = parseFloat(this.human_image_elems[0].style.top)
            let old_left = parseFloat(this.human_image_elems[0].style.left)
            let new_left = P_x + t * (old_left - P_x) + "px";
            let new_top = P_y + t * (old_top - P_y) + "px";
            //console.log("new_left,new_top="+[new_left,new_top])
            for (let i=0;i<this.human_image_elems.length;i++){
                //画像のサイズを変更
                this.human_image_elems[i].style.height = `${height}vh`
                //画像の位置を変更
                this.human_image_elems[i].style.top = new_top;
                this.human_image_elems[i].style.left = new_left;
            }
            this.search_canvas_elem.style.height = `${height}vh`

            //mouseUpとmouseDownを発火させる
            this.mouseUp(e);
            this.mouseDown(e);
            

        }

    }
}

function addPixelValues(px1: string, px2: string): string {
    const num1 = parseInt(px1, 10);
    const num2 = parseInt(px2, 10);
    const sum = num1 + num2;
    return sum + "px";
}


function addMoveImageEvent(human_images_elem: Element, humanBodyManager: HumanBodyManager2) :void{
    //1個のdrag_and_dropクラスを動かせるようにする
    console.log("dragオブジェクトを準備する",human_images_elem);
    const drag_drop_object_status = new DragDropObjectStatus(human_images_elem,humanBodyManager);
    let oprator_canvas_elem = human_images_elem.getElementsByClassName("operator_canvas")[0]
    oprator_canvas_elem.addEventListener("mousedown",drag_drop_object_status);
    oprator_canvas_elem.addEventListener("touchstart",drag_drop_object_status);
    oprator_canvas_elem.addEventListener("mouseup",drag_drop_object_status);
    oprator_canvas_elem.addEventListener("mousemove",drag_drop_object_status);
    oprator_canvas_elem.addEventListener("wheel",drag_drop_object_status);
}




function getNthValueFromObject(dict,n){
    return Object.values(dict)[n]
}

function getNthKeyFromObject(dict,n){
    return Object.keys(dict)[n]
}

function deepFreeze(object) {
    // プロパティの値がオブジェクトである場合、再帰的に凍結
    for (let key in object) {
        if (typeof object[key] === 'object' && object[key] !== null) {
            deepFreeze(object[key]);
        }
    }

    // オブジェクト自体を凍結
    return Object.freeze(object);
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

interface ZIndexRange {
    start: number; // 開始インデックス
    end: number;   // 終了インデックス
}

interface PartInfo {
    // z_index: number; // zインデックス
    z_index_range: ZIndexRange; // zインデックスの範囲
    imgs: BodyUnitVariationImagesMap; // 画像データ
    now_imgs_status: BodyUnitValue; // 現在の画像ステータス
    mode_radio_duplicate: string; // モードラジオの重複
    name: string; // 名前
    body_img_elemnt_map: ExtendedMap<string, HTMLCanvasElement>; // 体の画像要素のマップ
    duplicate_element: any; // 重複要素
}

type MapPartInfo = ExtendedMap<string, any>; // PartInfoの拡張

interface PartsPath {
    folder_name: string;
    file_name: string;
}

interface CharaCanvasInitData {
    width: number;
    height: number;
    top: number;
    left: number;
}

type OpenClose = "open"|"close"|""
type OnOff = "on"|"off"
type PakupakuType = "口" | "パクパク" | "パチパチ" | "ぴょこぴょこ";
type PakuType = "パク" | "パチ" | "ぴょこ";
type MousePakuType = "口" | PakuType;
type OpenCandidateCloseType = "開候補"|"閉"
type BodyPartsImagesMap = Map<BodyUnitKey, BodyUnitVariationImages>;

export class HumanBodyManager2 {
    debug: boolean;
    front_name: string;
    char_name: string;
    body_parts_is_visible: ExtendedMap<string, boolean>;
    body_parts_canvas: ExtendedMap<string, HTMLCanvasElement>;
    chara_canvas_init_data: CharaCanvasInitData;
    body_parts_info: ExtendedMap<BodyUnitKey,PartInfo>
    init_image_info: PoseInfo
    body_parts_images: BodyPartsImagesMap;
    mouse_folder_name: string
    mouse_images:ExtendedMap<string, string> = new ExtendedMap();
    patipati_folder_name: string
    patipati_images:ExtendedMap<string, string> = new ExtendedMap();
    pyokopyoko_folder_name: string
    pyokopyoko_images:ExtendedMap<string, string> = new ExtendedMap();
    lip_sync_mode:"口"|"パクパク"|"無し" = "無し"
    onomatopoeia_action_setting:Record<"パク"|"パチ"|"ぴょこ",Record<"開候補"|"閉",PartsPath[]>> = {
        "パク":{"開候補":[],"閉":[]},
        "パチ":{"開候補":[],"閉":[]},
        "ぴょこ":{"開候補":[],"閉":[]}
    }
    now_onomatopoeia_action:Record<"パク"|"パチ"|"ぴょこ",PartsPath[]> = {
        "パク":[],
        "パチ":[],
        "ぴょこ":[]
    }
    pose_patterns: ExtendedMap<PoseInfoKey, PoseInfoMap>;
    oprator_canvas: HTMLCanvasElement;
    human_window: Element;
    human_images: Element;
    prev_pakupaku: OpenClose;
    pakupaku_info:ExtendedMap<PakupakuType, ExtendedMap<any, any>>
    pakupaku_folder_names:ExtendedMap<any, any>
    voiro_ai_setting: VoiroAISetting
    public characterModeState: ICharacterModeState 
    public get characterId(): string {
        return this.characterModeState.id;
    }

    constructor(body_parts:HumanData,characterModeState:ICharacterModeState,human_window:Element|null = null){
        this.characterModeState = characterModeState;
        this.debug = false;
        this.front_name = body_parts.front_name;
        this.char_name = body_parts["char_name"];

        console.log(body_parts)
        let body_parts_iamges = body_parts["body_parts_iamges"];
        this.body_parts_images = new ExtendedMap(Object.entries(body_parts_iamges));
        console.log(this.body_parts_images)

        //body_parts["init_image_info"]["init"]がないエラーがあるので、エラーキャッチを実装
        try{
            if ("init_image_info" in body_parts){
                let init_image_info = body_parts["init_image_info"];
                let pose_patterns = this.setPosePatternFromInitImageInfo(init_image_info);
                this.pose_patterns = pose_patterns;
                if ("OnomatopeiaActionSetting" in init_image_info) {
                    this.onomatopoeia_action_setting = deepCopy(init_image_info["OnomatopeiaActionSetting"]);
                    
                } 
                if ("NowOnomatopoeiaActionSetting" in init_image_info) {
                    // debugger;
                    this.now_onomatopoeia_action = deepCopy(init_image_info["NowOnomatopoeiaActionSetting"]);
                    console.log(this.now_onomatopoeia_action)
                }
                if ("init" in init_image_info){
                    this.init_image_info = (init_image_info["init"]);
                    console.log(this.init_image_info)
                }else{
                    throw new Error("body_parts[\"init_image_info\"]はあるが、body_parts[\"init_image_info\"][\"init\"]がありません。")
                }
            }else{
                throw new Error("body_parts[\"init_image_info\"]がありません。")
            }
        }catch(e){
            console.log((e as Error).message);
            this.init_image_info = {};
        }

        //各体パーツの画像の情報を格納したオブジェクトを作成
        this.body_parts_info = new ExtendedMap<string, PartInfo>();
        let z_index_counter_start = 0;
        let z_index_counter_end = -1;

        //パクパクなどをまとめて格納するためのオブジェクトを初期化
        this.pakupaku_info = new ExtendedMap();
        const pakupaku_list:PakupakuType[] = ["口","パクパク","パチパチ","ぴょこぴょこ"]
        this.pakupaku_folder_names = new ExtendedMap();
        for (let pakupaku of pakupaku_list){
            this.pakupaku_info.set(pakupaku,new ExtendedMap());            
        }

        //体パーツの画像の情報を格納したオブジェクトを作成
        for (let key_part_name of this.body_parts_images.keys()) {
            //key_part_nameの文字列に口が含まれていたら、それを特別なプロパティに格納。promiseで行う。
            // key_part_name:BodyUnitKey 
            const part_info = this.body_parts_images.get(key_part_name);
            if (!part_info) {
                continue;
            }
            
            //体パーツのjsonファイルがある場合、口の情報を取得する
            for (let [part_img_name,part_img_info] of Object.entries(part_info))
            {
                const part_json = part_img_info["json"];
                for (let pakupaku of pakupaku_list){
                    if (pakupaku in part_json){//todo ここは通らないはずなので確認して消す
                        // this.pakupaku_folder_names.set(pakupaku,key_part_name);
                        const pakupaku_param = part_json[pakupaku];
                        this.pakupaku_info.get(pakupaku)?.set(pakupaku_param,[key_part_name,part_img_name]);
                    }
                }
            }
            
            
            if (key_part_name == "front_name" || key_part_name == "char_name") {
                continue;
            } else {
                console.log(key_part_name,this.body_parts_images,part_info)
                z_index_counter_start = z_index_counter_end + 1;
                z_index_counter_end = z_index_counter_start + Object.keys(part_info).length - 1;
                const partInfo: PartInfo = {
                    // "z_index": (key_part_name.match(/\d+/))[0],//todo もう使わないので消す。一応確認する。
                    "z_index_range": {"start": z_index_counter_start, "end": z_index_counter_end},
                    "imgs": convertBodyUnitVariationImagesToMap(part_info),
                    "now_imgs_status": deepCopy(this.pose_patterns.get("init")?.get(key_part_name)),
                    "mode_radio_duplicate": "radio",
                    "name": key_part_name,
                    "body_img_elemnt_map": new ExtendedMap(),
                    "duplicate_element": null 
                };

                this.body_parts_info.set(key_part_name, partInfo); 
            }
        }
        this.body_parts_info.sort(
            (a, b) => {
                const keyA = parseInt(a[0].split('_')[0]);
                const keyB = parseInt(b[0].split('_')[0]);
                return keyA - keyB;
            });

        //canvasの初期値を格納した辞書を作成。使うデータはbody_partsの中の最初の画像のデータ。
        this.chara_canvas_init_data = this.setCharaCanvasInitData();
        
        //名前入力時点でhuman_windowのelementにnameも追加されてるのでそれを取得する。
        this.human_window = human_window || document.getElementsByClassName(`${this.front_name}`)[0];
        this.human_images = this.human_window.getElementsByClassName("human_images")[0];
        let promise_setBodyParts2Elm = new Promise((resolve,reject) => {
            //search_canvasでのモード
            this.setBodyParts2Elm();
            // @ts-ignore
            resolve();
        })
        promise_setBodyParts2Elm.then(() => {
            console.log(`${this.front_name}インスタンスを生成しました。`);
            console.log(this.human_window);

            this.human_window = document.getElementsByClassName(`${this.front_name}`)[0];
            this.human_images = this.human_window.getElementsByClassName("human_images")[0];
            //画像をドラッグで動かせるようにする
            addMoveImageEvent(this.human_images,this);
        })

        // this.PatiPatiProcess("パチパチ");
        // this.PyokoPyokoProcess("ぴょこぴょこ");

        this.PatiPatiProcess2("パチ");
        this.PyokoPyokoProcess2("ぴょこ");


    }

    setCharaCanvasInitData(): CharaCanvasInitData{
        const [max_width,max_height] = this.getMaxSizeOfBodyParts(this.body_parts_images);

        const chara_canvas_init_data: CharaCanvasInitData = {
            "width":max_width,
            "height":max_height,
            "top":0,
            "left":0,
        };
        return chara_canvas_init_data;
    }

    getMaxSizeOfBodyParts(body_parts_images: BodyPartsImagesMap): [number, number] {
        let max_width = 0;
        let max_height = 0;
        for (let [key_part_name, part_info] of body_parts_images.entries()) {
            for (let [part_img_name, part_img_info] of Object.entries(part_info)) {
                const width = part_img_info.json.width + part_img_info.json.x;
                const height = part_img_info.json.height + part_img_info.json.y;
    
                if (width > max_width) {
                    max_width = width;
                }
                if (height > max_height) {
                    max_height = height;
                }
            }
        }
        return [max_width, max_height];
    }

    /**
     * 組み合わせ名。例えば、"init","^^"など。
     **/
    getPosePattern(combination_name: string):PoseInfoMap | undefined {
        console.log("呼び出し");
        const pose_pattern = this.pose_patterns.get(combination_name);
        return pose_pattern;
    }

    /**
     * - 組み合わせ名。例えば、"init","^^"など。
     * - 体のパーツグループの名前。例えば、"口"など。
     **/
    getPartstatusInPosePattern(combination_name:string ,part_name:string ): BodyUnitValue | undefined{
        const pose_pattern = this.getPosePattern(combination_name);
        const part_status = pose_pattern?.get(part_name);
        return part_status;
    }

    setPosePatternFromInitImageInfo(init_image_info:InitImageInfo):ExtendedMap<PoseInfoKey,PoseInfoMap>{
        const pose_pattern:ExtendedMap<string,PoseInfoMap> = new ExtendedMap();
        for (let [key, value] of Object.entries(init_image_info)) {
            //todo InitImageInfoの型にPoseDictを追加して、initはその要素に変更して、↓のif文を使わなくてもPose情報を取得できるようにする。
            if (!["all_data", "OnomatopeiaActionSetting", "NowOnomatopoeiaActionSetting", "setting"].includes(key)) {
                const iamge_info:PoseInfoMap = new ExtendedMap(Object.entries(value).sort(
                        (a, b) => {
                            const keyA = parseInt(a[0].split('_')[0]);
                            const keyB = parseInt(b[0].split('_')[0]);
                            return keyA - keyB;
                        }
                    )) as PoseInfoMap;
                
                pose_pattern.set(key,iamge_info);
            }
        }
        return pose_pattern;
    }


    setBodyParts2Elm(): void{
        var self = this
        //body_partsに対応するhtml要素を作成して、画像を各要素に配置する処理
        //各要素にはクリックしたときに別の画像に順番に切り替える処理を追加する
        console.log("画像の配置を開始")
        //各レイヤーに画像を配置するが、同じレイヤーに複数画像を配置できるようにする。
        let promise = new Promise(function(resolve,reject){
            let body_parts_info_entries:MapIterator<[BodyUnitKey, PartInfo]> = self.body_parts_info.entries();

            for (let [part_group_name/** @type {BodyUnitKey} */, part_info] of body_parts_info_entries) {
                let image_info_entries = part_info["imgs"].entries();
                for (let [part_name /** @type {BodyUnitVariationKey} */, iamge_info] of image_info_entries) {
                    const on_off = self.getImgStatus(part_group_name, part_name);
                    if (on_off == "off") {
                        continue;
                    } else {
                        let body_img = self.createBodyImageCanvasAndSetImgStatus(part_group_name,part_info,part_name,iamge_info,on_off);
                        //changeImage()でパーツを変更するときに使うので各パーツのelementをmap_body_parts_infoに格納する
                        self.setBodyImgElemnt(part_group_name, part_name, body_img)
                    }

                }

            }
            // @ts-ignore
            resolve()
        })
        promise.then(function(){
            console.log("画像の配置が完了しました。");
            //画像の配置が完了したのでno_image_humanクラスをこのエレメントから削除する
            self.human_window.classList.remove("no_image_human");
            //画像を操作するためのcanvasを作成する
            self.createOperatorCanvas();
        })                   
    }

    
    createBodyImageCanvasAndSetImgStatus(part_group_name:BodyUnitKey, part_info:PartInfo, part_name:BodyUnitVariationKey, iamge_info:BodyUnitVariationImageInfo, on_off:OnOff): HTMLCanvasElement{
            //canvasを作成して、そのcanvasに画像を描画する
            let body_img = this.createBodyImageCanvas(part_group_name,part_info,part_name,iamge_info)

            //画像のオンオフの現在のステータスを反映する
            this.changeImgStatus(part_group_name,part_name,on_off,body_img);

            return body_img;
    }

    /**
     * canvasを作成して、そのcanvasに画像を描画すし、z-indexを設定し、human_imagesの子エレメントに追加する
     */
    createBodyImageCanvas(part_group_name:BodyUnitKey ,part_info:PartInfo ,part_name:BodyUnitVariationKey ,iamge_info:BodyUnitVariationImageInfo): HTMLCanvasElement{
        //canvasを作成して、そのcanvasに画像を描画する
        var body_img = this.createPartCanvas()
        body_img.classList.add("human_image",`${part_group_name}_img`,`${part_name}_img`,`${this.front_name}_img`)
        this.drawPart(body_img, iamge_info);
        //todo body_imgのz-indexを設定する
        body_img.style.zIndex = String(iamge_info["json"]["z_index"]);//String(part_info["z_index"]);
        this.human_images.appendChild(body_img);
        return body_img;
    }

    createPartCanvas(): HTMLCanvasElement{
        var self = this;
        var part_canvas = document.createElement("canvas");
        //canvasの大きさを設定。場所は画面左上に設定。
        part_canvas.width = Number(self.chara_canvas_init_data["width"]);
        part_canvas.height = Number(self.chara_canvas_init_data["height"]);
        part_canvas.style.position = "absolute";
        part_canvas.style.top = String(self.chara_canvas_init_data["top"]);
        part_canvas.style.left = String(self.chara_canvas_init_data["left"]);
        //canvasにクラスを追加
        part_canvas.classList.add("part_canvas");

        return part_canvas;
    }

    /**
     * 
     * @param {HTMLCanvasElement} canvas - 画像を描画するcanvas
     * @param {BodyUnitVariationImageInfo} image_info - 体のパーツの情報を格納した辞書
     * 
     **/
     drawPart(canvas:HTMLCanvasElement ,image_info:BodyUnitVariationImageInfo): void{
        var self = this;
        // console.log(image_info);
        //canvasに描画
        const ctx:CanvasRenderingContext2D|null = canvas.getContext('2d');
        //canvasをクリア。始点( x , y ) から幅w、高さhの矩形を透明色で初期化します。
        ctx?.clearRect(0,0,canvas.width,canvas.height);
        //body_parts_infoの中の各パーツの画像をcanvasに描画する
        const body_part4canvas = new Image();
        const src = image_info["img"];
        const src_data = image_info["json"];
        // console.log("src_data=",src_data)
        body_part4canvas.src = `data:image/png;base64,${src}`;
        //src_dataは{"name": "1_*1.png","x": 760,"y": 398,"width": 337,"height": 477}のような形式。これの通りに画像の座標と縦横を設定する。
        body_part4canvas.onload = function(){
            ctx?.drawImage(body_part4canvas,src_data["x"],src_data["y"],src_data["width"],src_data["height"]);
        }
    }

    createOperatorCanvas(){
        console.log("createOperatorCanvas");
        var self = this;
        //1:canvasを作成する。canvasの大きさはONE_imgエレメントの大きさと同じにする。
        var oprator_canvas = document.createElement("canvas");
        
        
        oprator_canvas.width = self.chara_canvas_init_data["width"] //self.ONE_img_width;
        oprator_canvas.height = self.chara_canvas_init_data["height"];
        oprator_canvas.style.position = "absolute";
        oprator_canvas.style.top = String(self.chara_canvas_init_data["top"]);
        oprator_canvas.style.left = String(self.chara_canvas_init_data["left"]);
       
        //canvasにクラスを追加
        oprator_canvas.classList.add("human_image","operator_canvas",`${self.front_name}_img`);
        //canvasのstyleを設定。ONE_imgエレメントの位置に合わせる。
        oprator_canvas.style.zIndex = String(ZIndexManager.HumanOperatorCanvas);
        //canvasをhuman_imagesクラスに追加
        var human_images_elem = this.human_window.getElementsByClassName("human_images")[0];
        human_images_elem.appendChild(oprator_canvas);
        this.oprator_canvas = oprator_canvas;
    }

    /**
     * 現在の体パーツのキャンバスの座標と大きさを取得する
     */
    getOperatorCanvasCssStyle():HumanBodyCanvasCssStylePosAndSize {
        return {
            "height": this.oprator_canvas.style.height,
            "top": this.oprator_canvas.style.top,
            "left": this.oprator_canvas.style.left,
        }
    }

    /**
     * 体のパーツの画像のhtmlエレメントを設定する
     * @param {string} part_group_name
     * @param {string} part_name
     * @param {HTMLCanvasElement} body_img_elemnt
     */
    setBodyImgElemnt(part_group_name: BodyUnitKey ,part_name:BodyUnitVariationKey ,body_img_elemnt: HTMLCanvasElement){
        const part_info = this.getPartInfoFromPartGroupName(part_group_name);
        const body_img_elemnt_map = part_info?.body_img_elemnt_map
        body_img_elemnt_map?.set(part_name,body_img_elemnt);
    }

    /**
     * 体のパーツの画像のhtmlエレメントを取得する
     */
    getBodyImgElemnt(part_group_name:BodyUnitKey ,part_name:BodyUnitVariationKey): HTMLCanvasElement|null{
        const part_info = this.getPartInfoFromPartGroupName(part_group_name);
        const body_img_elemnt_map = part_info?.body_img_elemnt_map
        if (body_img_elemnt_map?.has(part_name) == false){
            //initでoffになっているパーツの場合、まだ作られてないのでnullを返し、これから作る。
            return null;
        }
        const body_img_elemnt = body_img_elemnt_map?.get(part_name) ?? (() => {throw new Error("body_img_elemntがundefinedです。")})();
        return body_img_elemnt;
    }

    /**
     * 体のパーツの画像のステータスを変更する
     * @param {BodyUnitKey} image_group - 画像のグループ名
     * @param {BodyUnitVariationKey} image_name - 画像の名前
     * @param {OnOff} on_off - 画像をonにするかoffにするか
     * @param {HTMLCanvasElement} body_img - 体のパーツの画像のhtmlエレメント
     */
    changeImgStatus(image_group:BodyUnitKey, image_name:BodyUnitVariationKey, on_off:OnOff, body_img:HTMLCanvasElement){

        //body_imgをdisplay:noneにする
        if (on_off == "off") {
            body_img.style.display = "none";
        } else {
            body_img.style.display = "block";
        }
        //画像のステータスを変更する
        this.setImgStatus(image_group,image_name,on_off)
    }

    /**
     * 体のパーツ画像が設定されてるか確認し、されてる場合はchangeImgStatusし、されてない場合はcreateBodyImageCanvasを実行する
     * アコーディオンのクリックイベントで呼ばれる、キャラのパーツを変更するメソッド。
     * 
     * @param {BodyUnitKey} image_group - 画像のグループ名
     * @param {BodyUnitVariationKey} image_name - 画像の名前
     * @param {OnOff} on_off - 画像をonにするかoffにするか
     * 
     **/
    changeBodyPart(image_group:BodyUnitKey ,image_name:BodyUnitVariationKey ,on_off:OnOff){
        let body_img = this.getBodyImgElemnt(image_group,image_name);
        if (body_img == null){
            //body_imgがnullの場合、まだ作られてないので作成する。
            const part_info = this.getPartInfoFromPartGroupName(image_group); if (part_info == undefined){throw new Error("part_infoがundefinedです。");}
            const iamge_info = part_info?.imgs.get(image_name); if (iamge_info == undefined){throw new Error("iamge_infoがundefinedです。");}
            // body_img = this.createBodyImageCanvas(image_group,part_info,image_name,iamge_info);
            let body_img = this.createBodyImageCanvasAndSetImgStatus(image_group,part_info,image_name,iamge_info,on_off);
            //最新の座標と大きさを設定
            this.setNowHumanBodyCanvasCssStylePosAndSize(body_img)
            //changeImage()でパーツを変更するときに使うので各パーツのelementをmap_body_parts_infoに格納する
            this.setBodyImgElemnt(image_group, image_name, body_img)
        } else {
            this.changeImgStatus(image_group,image_name,on_off,body_img);
        }
        
    }

    /**
     * 体のパーツの画像のステータスを変更する
     * @param {HTMLCanvasElement} body_img - 体のパーツの画像のhtmlエレメント
     */
    setNowHumanBodyCanvasCssStylePosAndSize(body_img){
        const style = this.getOperatorCanvasCssStyle();
        body_img.style.height = style.height;
        body_img.style.top = style.top;
        body_img.style.left = style.left;
    }

    /**
     * 各体のパーツのpart_infoを返す
     * @param {string} part_group_name 
     * @returns {PartInfo}
     */
    getPartInfoFromPartGroupName(part_group_name:BodyUnitKey): PartInfo | undefined{
        const part_info = this.body_parts_info.get(part_group_name)
        return part_info;
    }

    /**
     * どの体のパーツがon,offになっているかのステータス辞書を返す
     */
    getNowImgGroupStatusFromPartGroupName(image_group_name: BodyUnitKey): BodyUnitValue {
        const imgs_status = this.getPartInfoFromPartGroupName(image_group_name)?.now_imgs_status; 
        if(imgs_status == undefined){throw new Error("imgs_statusがundefinedです。");}
        return imgs_status;
    }

    /**
     * 体の画像のグループ名から、オン(またはオフ)になっている画像の名前のリストを返す
     */
    getNowOnImgNameList(image_group_name: BodyUnitKey, on_off:OnOff): BodyUnitVariationKey[]{
        const imgs_status = this.getNowImgGroupStatusFromPartGroupName(image_group_name);
        if (imgs_status == undefined){
            return [];
        }
        const on_img_name_list:BodyUnitVariationKey[] = Object.keys(imgs_status).filter((key) => imgs_status[key] === on_off);
        return on_img_name_list;
    }

    /**
     * 体の画像１枚がオンかオフかを返す
     */
    getImgStatus(image_group:string ,image_name:string): OnOff{
        const img_group_status = this.getNowImgGroupStatusFromPartGroupName(image_group);
        if (img_group_status == undefined){
            return "off";
        }
        const img_status = img_group_status[image_name];
        return img_status;
    }

    /**
     * 体の画像１枚がオンかオフかを設定する
     */
    setImgStatus(image_group:BodyUnitKey, image_name:BodyUnitVariationKey ,on_off:OnOff){
        const img_group_status = this.getNowImgGroupStatusFromPartGroupName(image_group);
        if (img_group_status == undefined){
            return;
        }
        img_group_status[image_name] = on_off;
    }

    /**
     * image_group_nameの中でimage_nameだけをオンにして、それ以外をオフにする
     */
    radioChangeImage(image_group_name:BodyUnitKey ,image_name:BodyUnitVariationKey, on_off:OnOff){
        if (on_off == "on"){
            const now_on_img_names:BodyUnitVariationKey[] = this.getNowOnImgNameList(image_group_name,"on");
            for (let i=0;i<now_on_img_names.length;i++){
                const now_img_name:BodyUnitVariationKey = now_on_img_names[i];
                this.changeBodyPart(image_group_name,now_img_name,"off");
            }
            this.changeBodyPart(image_group_name,image_name,"on");
        } else {
            this.changeBodyPart(image_group_name,image_name,"off");
        }
    }

    /**
     * 口パクの画像を変更する
     * @param {CharacterId} id - キャラの名前
     * @param {string} phoneme - 音素
     */
    changeLipImage(id:CharacterId ,phoneme:string){
        // if (this.mouse_images.size > 1) {
        //     console.log("口を動かす。",phoneme);
        //     if (this.mouse_images.has(phoneme)){
        //         const next_img_name = this.mouse_images.get(phoneme);
        //         this.radioChangeImage(this.mouse_folder_name, next_img_name, "on")
        //     }
        // }
        if (["a","i","u","e","o"].includes(phoneme) == false){
            return;
        }
        switch(this.lip_sync_mode){
            case "口":
                this.changePakuPakuImage("口",phoneme,"on");
                break;
            case "パクパク":
                if(this.prev_pakupaku == "close"){
                    // this.changePakuPakuImage("パクパク","open","on");
                    this.changeOnomatopoeiaImage("パク","open","on");
                    this.changeOnomatopoeiaImage("パク","close","off");
                    this.prev_pakupaku = "open";
                }else{
                    // this.changePakuPakuImage("パクパク","close","on");
                    this.changeOnomatopoeiaImage("パク","close","on");
                    this.changeOnomatopoeiaImage("パク","open","off");
                    this.prev_pakupaku = "close";
                }
                break;
            case "無し":
                break;
        }
    }

    /**
     * 
     * @param {PakupakuType} pakupaku_mode - パクパクのモード。pakupaku_listの中から選べる。"口","パクパク","パチパチ","ぴょこぴょこ"など。
     * @param {string|OnOff} pakupaku - パクパクの名前。口ならば音素、ぱちぱちならば目の形の名前など。今はOnOffだけだが、後で音素なども追加したい
     * @param {"on"|"off"} on_off - オンかオフか 
     * todo on_offを指定しているのに使用していないので処理を見直す
     */
    changePakuPakuImage(pakupaku_mode: PakupakuType,pakupaku: string|OpenClose, on_off:OnOff){
        if (this.pakupaku_info.has(pakupaku_mode)) {
            if (this.pakupaku_info.get(pakupaku_mode)?.has(pakupaku)){
                const pakupaku_folder_name = this.pakupaku_info.get(pakupaku_mode)?.get(pakupaku)[0];
                const next_img_name = this.pakupaku_info.get(pakupaku_mode)?.get(pakupaku)[1];
            }
        }
    }

    /**
     * @param {PakuType} onomatopoeia_action_mode
     * @param {OpenClose} openCloseState - 開状態の画像を操作するか閉状態を操作するか
     * @param {OnOff} on_off - 操作でオンにするかオフにするか
     */
    changeOnomatopoeiaImage(onomatopoeia_action_mode:PakuType, openCloseState:OpenClose, on_off:OnOff){
        let action_setting = this.onomatopoeia_action_setting[onomatopoeia_action_mode];
        let now_onomatopoeia_list = this.now_onomatopoeia_action[onomatopoeia_action_mode];
        if (now_onomatopoeia_list == undefined) {
            return;
        }
        if (openCloseState == "open") {
            if (on_off == "on") {
                //now_onomatopoeiaの画像を全てオンにする
                console.log("前回の開だったものをオンにします")
                for (let now_onomatopoeia of now_onomatopoeia_list){
                    console.log(now_onomatopoeia.folder_name, now_onomatopoeia.file_name);
                    this.voiro_ai_setting?.setGroupButtonOnOff(now_onomatopoeia.folder_name, now_onomatopoeia.file_name, "on");
                }
            } else {
                //action_setting["開候補"]の画像を全てオフにする
                console.log("開候補をオフにする")
                for (let onomatopoeia of action_setting["開候補"]){
                    this.voiro_ai_setting?.setGroupButtonOnOff(onomatopoeia.folder_name, onomatopoeia.file_name, "off");
                }
            }
        } else if (openCloseState == "close") {
            if (on_off == "on") {
                console.log("閉をオンにする")
                //action_setting["閉"]の画像からランダムで１つオンにする
                const random_close_enable = false
                if (action_setting["閉"].length > 0 && random_close_enable){
                    let onomatopoeia = action_setting["閉"][Math.floor(Math.random() * action_setting["閉"].length)];
                    this.voiro_ai_setting?.setGroupButtonOnOff(onomatopoeia.folder_name, onomatopoeia.file_name, "on");
                } else {
                    //action_setting["閉"]の画像をすべてオンにする
                    for (let onomatopoeia of action_setting["閉"]){
                        this.voiro_ai_setting?.setGroupButtonOnOff(onomatopoeia.folder_name, onomatopoeia.file_name, "on");
                    }
                }
            } else {
                //action_setting["閉"]の画像をすべてオフにする
                console.log("閉をオフにする")
                for (let onomatopoeia of action_setting["閉"]){
                    this.voiro_ai_setting?.setGroupButtonOnOff(onomatopoeia.folder_name, onomatopoeia.file_name, "off");
                }
            }
        }
    }
    
    /**
     * パクパクのモード。pakupaku_listの中から選べる。"口","パクパク","パチパチ","ぴょこぴょこ"など。
     */
    async PatiPatiProcess(patipati_mode: PakupakuType){
        console.log("パチパチプロセス開始");
        //20秒ごとにパチパチをする
        while (true){
            console.log(patipati_mode);
            await this.sleep(20000);
            this.changePakuPakuImage(patipati_mode,"close","on");
            this.changePakuPakuImage(patipati_mode, "open", "off")
            await this.sleep(100);
            this.changePakuPakuImage(patipati_mode,"open","on");
            this.changePakuPakuImage(patipati_mode,"close","off");
        }
    }

    /**
     *  パクパクのモード。
     */
    async PatiPatiProcess2(patipati_mode: PakuType){
        console.log("パチパチプロセス開始");
        //20秒ごとにパチパチをする
        while (true){
            console.log(patipati_mode);
            await this.sleep(20000);
            this.changeOnomatopoeiaImage(patipati_mode,"close","on");
            this.changeOnomatopoeiaImage(patipati_mode, "open", "off")
            await this.sleep(100);
            this.changeOnomatopoeiaImage(patipati_mode,"open","on");
            this.changeOnomatopoeiaImage(patipati_mode,"close","off");
        }
    }

    /**
     * パクパクのモード。
     */
    async PyokoPyokoProcess2(patipati_mode: PakuType){
        console.log("ぴょこぴょこプロセス開始");
        //20秒ごとにぴょこぴょこをする
        while (true){
            console.log(patipati_mode);
            //5~20秒の間でランダムなタイミングでぴょこぴょこをする
            const timing = Math.floor(Math.random() * (20000 - 5000) + 5000);
            await this.sleep(timing);
            // await this.sleep(100);
            this.changeOnomatopoeiaImage(patipati_mode,"close","on");
            this.changeOnomatopoeiaImage(patipati_mode, "open", "off")
            await this.sleep(100);
            this.changeOnomatopoeiaImage(patipati_mode,"open","on");
            this.changeOnomatopoeiaImage(patipati_mode, "close", "off")
            await this.sleep(100);
            this.changeOnomatopoeiaImage(patipati_mode,"close","on");
            this.changeOnomatopoeiaImage(patipati_mode, "open", "off")
            await this.sleep(100);
            this.changeOnomatopoeiaImage(patipati_mode,"open","on");
            this.changeOnomatopoeiaImage(patipati_mode, "close", "off")
        }
    }

    /**
     * パクパクのモード。pakupaku_listの中から選べる。"口","パクパク","パチパチ","ぴょこぴょこ"など。
     */
    async PyokoPyokoProcess(patipati_mode: PakupakuType){
        console.log("ぴょこぴょこプロセス開始");
        //20秒ごとにぴょこぴょこをする
        while (true){
            console.log(patipati_mode);
            //5~20秒の間でランダムなタイミングでぴょこぴょこをする
            const timing = Math.floor(Math.random() * (20000 - 5000) + 5000);
            await this.sleep(timing);
            this.changePakuPakuImage(patipati_mode,"close","on");
            this.changePakuPakuImage(patipati_mode, "open", "off")
            await this.sleep(100);
            this.changePakuPakuImage(patipati_mode,"open","on");
            this.changePakuPakuImage(patipati_mode,"close","off");
            await this.sleep(100);
            this.changePakuPakuImage(patipati_mode,"close","on");
            this.changePakuPakuImage(patipati_mode, "open", "off")
            await this.sleep(100);
            this.changePakuPakuImage(patipati_mode,"open","on");
            this.changePakuPakuImage(patipati_mode,"close","off");
        }
    }

    /**
     * 
     * @param {*} ms 
     * @returns 
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    /**
     * パクパク設定で「パク」がオンになっていてパクパクを起動するようにユーザーが思っているか確認する。
     */
    checkOnPakuPaku():boolean{
        return this.onomatopoeia_action_setting["パク"]["閉"].length > 0
    }

    setLipSyncModeToPakuPaku(onomatopoeia_action_mode: PatiMode){
        if (onomatopoeia_action_mode == "パク"){
            this.lip_sync_mode = "パクパク";
            this.prev_pakupaku = "open";
        }
    }

    setLipSyncModeToAIUEO(onomatopoeia_action_mode: MousePakuType){
        if (onomatopoeia_action_mode == "口"){
            this.lip_sync_mode = "口";
            this.prev_pakupaku = "";
        }
    }

    setToOnomatopoeiaActionSetting(onomatopoeia_action_mode: PakuType, openCloseState: OpenCandidateCloseType, PartsPath: PartsPath){
        let action_setting = this.onomatopoeia_action_setting[onomatopoeia_action_mode];
        action_setting[openCloseState].push(PartsPath);
        console.log(this.onomatopoeia_action_setting);
    }

    removeFromOnomatopoeiaActionSetting(onomatopoeia_action_mode: PakuType, openCloseState: OpenCandidateCloseType, PartsPath: PartsPath){
        let action_setting = this.onomatopoeia_action_setting[onomatopoeia_action_mode];
        action_setting[openCloseState] = action_setting[openCloseState].filter((value) => {
            return !this.isEquivalentPartsPath(value,PartsPath);
        });
        console.log(this.onomatopoeia_action_setting)
    }

   
    isEquivalentPartsPath(PartsPath1: PartsPath, PartsPath2: PartsPath) :boolean {
        if (PartsPath1.folder_name == PartsPath2.folder_name && PartsPath1.file_name == PartsPath2.file_name){
            return true;
        } else {
            return false;
        }
    }


    BindVoiroAISetting(vas: VoiroAISetting){
        this.voiro_ai_setting = vas;
    }

        

}


export class VoiroAISetting{
    humanTab: IHumanTab;
    chara_human_body_manager: HumanBodyManager2;
    ELM_combination_name: HTMLDivElement;
    ELM_body_setting: HTMLDivElement;
    ELM_input_combination_name: HTMLInputElement;
    ELM_combination_box: HTMLLIElement;
    ELM_accordion: HTMLElement;
    accordion_item_dict: Record<string, AccordionItem>;
    ELM_combination_candidate: HTMLUListElement | null;

    constructor(chara_human_body_manager:HumanBodyManager2, humanTab: IHumanTab){
        this.humanTab = humanTab;
        console.log("VoiroAISetting constructor")
        this.ELM_body_setting = document.querySelector(".body_setting") ?? (() => { throw new Error("Element with class 'body_setting' not found"); })();
        this.chara_human_body_manager = chara_human_body_manager;

        var [ELM_accordion,accordion_item_dict] = this.createAccordion();
        this.ELM_accordion = ELM_accordion
        this.accordion_item_dict = accordion_item_dict
        this.ELM_body_setting.append(this.ELM_accordion);

        //オノマトペアクションの初期状態を設定する
        // todo ここで開閉ボタンを自動で押し、ぴょこ等も自動で押す処理を実装する
        this.setOnomatopeiaButtonToInitState();
        // todo ここでオンボタンをオンにする処理を実装する
        this.setOnBodyButtonToNowOnomatopeiaState();

    }

    
    createAccordion():[HTMLElement,Record<string,AccordionItem>]{
        var ELM_accordion = document.createElement("ul");
        ELM_accordion.classList.add("accordion");
        console.log(this.chara_human_body_manager)

        //組み合わせ名を表示する要素を追加
        this.ELM_combination_box = this.createElmCombinatioBox()
        ELM_accordion.appendChild(this.ELM_combination_box)

        var map = this.chara_human_body_manager.body_parts_info;
        
        /** @type {Record<string,AccordionItem>} */
        var accordion_item_dict = {};

        for (const [key, value] of map){
            //keyは体のパーツの名前、valueはそのパーツの画像群の配列
            let accordion_item = new AccordionItem(key, this.ELM_body_setting, this.chara_human_body_manager, this.humanTab);

            let ELM_accordion_item = accordion_item.html_doc.querySelector(".accordion_item") as HTMLUListElement;

            console.log(ELM_accordion_item);
            let ELM_accordion_item_name = accordion_item.html_doc.getElementsByClassName("accordion_item_name")[0];
            ELM_accordion_item_name.addEventListener("click",accordion_item);
            accordion_item_dict[key] = accordion_item;
            console.log(ELM_accordion,ELM_accordion_item);
            ELM_accordion.appendChild(ELM_accordion_item);
            accordion_item.ELM = ELM_accordion_item;
        }
        //組み合わせ名を入力するinput要素を追加
        this.ELM_input_combination_name = this.createElmInputCombinationName();
        ELM_accordion.appendChild(this.ELM_input_combination_name);

        return [ELM_accordion,accordion_item_dict];
    }

    /**
     * @returns {HTMLLIElement} ELM_combination_box
     */
    createElmCombinatioBox():HTMLLIElement{
        //boxを作成
        this.ELM_combination_box = document.createElement("li");
        this.ELM_combination_box.classList.add("combination_box","accordion_tab","open");

        //nameを作成
        this.ELM_combination_name = this.createElmCombinatioName();
        this.ELM_combination_box.appendChild(this.ELM_combination_name);

        //候補を作成
        this.ELM_combination_candidate = document.createElement("ul");
        this.ELM_combination_candidate.classList.add("combination_candidate");
        this.ELM_combination_box.appendChild(this.ELM_combination_candidate);
            //イベントハンドラーを追加
        const bcanm = new BodyCombinationAccordionManager(this.chara_human_body_manager, this, this.ELM_combination_box, this.ELM_combination_name, this.ELM_combination_candidate);
        this.ELM_combination_box.addEventListener("click",bcanm);

        return this.ELM_combination_box;
    }

    /**
     * "名無しの組み合わせ"というテキストを持つ、クラス名が "combination_name" の div 要素を作成します。
     * @returns {HTMLDivElement} "combination_name" クラスと "名無しの組み合わせ" テキストを持つ div 要素
     */
    createElmCombinatioName():HTMLDivElement{
        var ELM_combination_name = document.createElement("div");
        ELM_combination_name.classList.add("combination_name");
        ELM_combination_name.innerText = "名無しの組み合わせ";
        return ELM_combination_name;
    }


    /**
     * @returns {HTMLInputElement} "input_combination_name" クラスを持つ input 要素
     */
    createElmInputCombinationName():HTMLInputElement{
        var ELM_input_combination_name = document.createElement("input");
        ELM_input_combination_name.type = "text";
        ELM_input_combination_name.classList.add("input_combination_name");
        ELM_input_combination_name.placeholder = "組み合わせ名を入力";
        ELM_input_combination_name.addEventListener("keypress",this.saveCombinationName.bind(this));
        return ELM_input_combination_name;
    }

    /**
     * 
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    saveCombinationName(event:KeyboardEvent):void {
        if (event.key == "Enter"){
            console.log("Enterが押されたよ")
            const combination_name = this.ELM_input_combination_name.value;
            this.ELM_combination_name.innerText = combination_name;
            this.ELM_input_combination_name.value = "";
            //サーバーに組み合わせ名を送信する
            this.sendCombinationName(combination_name);
        }
    }

    /**
     * 
     * @param {string} combination_name
     * @returns {void}
     */
    sendCombinationName(combination_name:string):void{
        console.log("sendCombinationNameを呼び出したよ")
        const all_now_images = this.getAllNowImages()
        const data = {
            "characterModeState":this.humanTab.characterModeState?.toDict(),
            "chara_name":this.chara_human_body_manager.char_name,
            "front_name":this.chara_human_body_manager.front_name,
            "combination_name":combination_name,
            "combination_data":all_now_images
        }
        //all_now_imagesをサーバーに送信する
        //websocketを作成
        var ws_combi_img_sender = new WebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/img_combi_save`)
        ws_combi_img_sender.onopen = function(event){
            console.log("img_combi_saveが開かれた。このデータを送る。",data)
            ws_combi_img_sender.send(JSON.stringify(data));
        }
        //websocketを閉じる
        ws_combi_img_sender.onclose = function(event){
            console.log("img_combi_saveが閉じられたよ")
        }
        //サーバーからメッセージを受け取ったとき
        ws_combi_img_sender.onmessage = function(event){
            console.log("img_combi_saveからメッセージを受け取ったよ")
            console.log(event.data)
        }
    }

    getAllNowImages():Record<string, Record<string, "on" | "off">>{
        let image_status_dict:Record<string, Record<string, "on" | "off">> = {};
        for (const [key_name, accordion_item] of Object.entries(this.accordion_item_dict)){
            
            
            let part_dict_on_off = /** @type {Record<string,"on"|"off">} */( {} );

            for (const [key, value] of Object.entries(accordion_item.accordion_content_handler_list)){
                part_dict_on_off[key] = value.on_off;
            }
            image_status_dict[key_name] = part_dict_on_off;
        }
        return image_status_dict;    
    }

    /**
     * 
     * @param {string} body_part_name
     * @param {string} image_name
     * @returns {void}
     * todo: 使用箇所探索不能
     */
    setBodyPartImage(body_part_name:string ,image_name:string):void {
        this.accordion_item_dict[body_part_name].setBodyPartImage(image_name);
    }

    /** 
     * @param {string} group_name
     * @param {string} content_name
     * @param {"on"|"off"} on_off
     */
    setGroupButtonOnOff(group_name:string, content_name:string, on_off:"on"|"off"):void {
        this.accordion_item_dict[group_name].setGroupButtonOnOff(content_name,on_off);
    }

    /**
     * @param {string} group_name
     * @param {"パク" | "パチ" | "ぴょこ"} onomatopoeia_mode
     * @param {"on" | "off"} on_off
     */
    setOnomatpeiaModeButtonOnOff(group_name:string, onomatopoeia_mode:"パク" | "パチ" | "ぴょこ" , on_off:"on" | "off"):void {
        let accordion_item = this.accordion_item_dict[group_name];
        accordion_item.setOnomatpeiaModeButtonOnOff(onomatopoeia_mode, on_off);
    }

    /** 
     * @param {string} group_name
     * @param {string} content_name
     * @param {"open"|"close"} open_close
     */
    setOnomatpeiaButtonOnOff(group_name:string, content_name:string, open_close:"open"|"close"):void {
        let handler_list = this.accordion_item_dict[group_name].accordion_content_handler_list;
        let handler = handler_list[content_name];
        let pati_setting_toggle_event_object = handler.pati_setting_toggle_event_object;
        pati_setting_toggle_event_object.setButtonOpenClose(open_close);

    }

    /**
     * todo パチパク設定
     */
    setOnomatopeiaButtonToInitState(){
        
        let key:"パク" | "パチ" | "ぴょこ";
        let openCloseState:"開候補" | "閉";

        for (key in this.chara_human_body_manager.onomatopoeia_action_setting){
            let action_setting = this.chara_human_body_manager.onomatopoeia_action_setting[key];
            for (openCloseState in action_setting){
                let parts_list = action_setting[openCloseState];
                
                let open_close:"open"|"close" = "open";
                if (openCloseState == "閉"){
                    open_close = "close";
                }

                for (let parts_path of parts_list){
                    // debugger;
                    this.setOnomatpeiaModeButtonOnOff(parts_path.folder_name, key, "on")
                    this.setOnomatpeiaButtonOnOff(parts_path.folder_name, parts_path.file_name, open_close)
                }
            }
            if (key == "パク" && action_setting["閉"].length > 0){
                // リップシンクをオンにするかどうかの処理
                this.chara_human_body_manager.setLipSyncModeToPakuPaku(key);
            }
        }
    }

    /**
     * todo オノマトペアクションでオンにしていた体パーツをオンにする
     */
    setOnBodyButtonToNowOnomatopeiaState(){
        let key:"パク" | "パチ" | "ぴょこ";
        for (key in this.chara_human_body_manager.now_onomatopoeia_action){
            let parts_list = this.chara_human_body_manager.now_onomatopoeia_action[key];
            for (let parts_path of parts_list){
                this.setGroupButtonOnOff(parts_path.folder_name, parts_path.file_name, "on");
            }
        }
    }

}

type PatiMode = "口"|"パク"|"パチ"|"ぴょこ"|"無";

/**
 * アコーディオンを展開したときに見えるアコーディオンコンテンツのクラス
 * パーツ名をクリックしたときに、ボタンの色を変え、人体モデルのパーツの表示を変え、プロパティのデータも変える
 */
export class AccordionItem{
    name_acordion:string;
    Parent_ELM_body_setting:HTMLElement;
    chara_human_body_manager:HumanBodyManager2;

    ELM:HTMLUListElement; //AccordionItemのエレメント全体
    ELM_accordion_item_name:HTMLDivElement;
    ELM_accordion_contents:HTMLUListElement;
    ELMs_accordion_content:HTMLCollection;
    contents_name_list:string[];
    statu_open_close:string;
    accordion_content_handler_list:Record<string, ContentButtonEventobject>;
    radio_mode:boolean; //このアコーディオンがラジオモードかどうか 
    image_item_status:Record<string,"on"|"off">;
    pati_setting_mode:PatiMode;
    html_doc:Document;
    humanTab: IHumanTab;

    /**
     * 
     * @param {string} name_acordion           body_setting要素内のアコーディオンの名前は、対応する画像名と同じにする
     * @param {HTMLElement} Parent_ELM_body_setting  body_settingの要素
     * @param {HumanBodyManager2} chara_human_body_manager
     */
    constructor(name_acordion:string, Parent_ELM_body_setting:HTMLElement, chara_human_body_manager:HumanBodyManager2, humanTab: IHumanTab){
        this.humanTab = humanTab;
        //引数の登録
        this.name_acordion = name_acordion;
        this.Parent_ELM_body_setting = Parent_ELM_body_setting;
        this.chara_human_body_manager = chara_human_body_manager;
        //this.contents_name_list = [...this.chara_human_body_manager.body_parts_info.get(name_acordion).get("imgs").keys()]
        const part_info:PartInfo = this.chara_human_body_manager.body_parts_info.get(name_acordion) ?? (() => { throw new Error("PartInfo not found"); })();
        this.contents_name_list = part_info.imgs.comvert2keysArray();
        
        console.log(this.contents_name_list)
        this.statu_open_close = "close";
        this.accordion_content_handler_list = {};
        //accordion_sampleを複製
        const HTML_str_accordion_sample = `
        <li class = "accordion_item close layer ">
            <div class="accordion_item_name accordion_tab">
                <div class="initial_display_object">
                    <div class="name_string">頭</div>
                    <div class="pati_setting">パチパク設定</div>
                </div>
                <div class="pati_setting_radio-buttons non_vissible">
                    <div class="pati_setting_radio-button kuchi">口</div>
                    <div class="pati_setting_radio-button kuchi">パク</div>
                    <div class="pati_setting_radio-button kuchi">パチ</div>
                    <div class="pati_setting_radio-button kuchi">ぴょこ</div>
                    <div class="pati_setting_radio-button kuchi on">無</div>
                </div>
            </div>
            <ul class = "accordion_contents non_vissible">
                <li class = "accordion_content body_part_image_name accordion_tab sample">
                    <div class="accordion_content_name_string">1.png</div>
                    <div class="accordion_content_pati_setting_toggle_button open">開</div>
                </li>
            </ul>
        </li>
        `;
        this.html_doc = ElementCreater.createNewDocumentFromHTMLString(HTML_str_accordion_sample)
        //名前を設定
        this.setAccordionItemName(name_acordion);
        this.radio_mode = false;
        this.setPatiSettingAction()
        //アコーディオンの中身を作成
        var [ELM_accordion_contents,accordion_content_handler_list] = this.createELMAccordionContents(name_acordion);
        this.ELM_accordion_contents = ELM_accordion_contents;
        this.ELM_accordion_item_name = this.html_doc.querySelector(".accordion_item_name") as HTMLDivElement;
        console.log(this.ELM_accordion_item_name)
        this.accordion_content_handler_list = accordion_content_handler_list;
        //オンになってるボタンがあるかどうか
        this.checkHasOnContentButton();
    }

    setPatiSettingAction(){
        this.setOpenPatiSettingAction();
        this.setClickPatiSettingAction();
    }

    setClickPatiSettingAction(){
        console.log("setClickPatiSettingActionが動いた")
        let ELMs_radio_button = this.html_doc.getElementsByClassName("pati_setting_radio-button") as HTMLCollectionOf<HTMLElement>;
        console.log(ELMs_radio_button)
        for (let i = 0; i < ELMs_radio_button.length; i++) {
            let ELM_radio_button:HTMLElement = ELMs_radio_button[i];
            console.log(ELM_radio_button)
            ELM_radio_button.addEventListener("click", (event:MouseEvent) => {
                console.log("pati_setting_radio-buttonがクリックされたよ")
                event.stopPropagation();
                let ELM_pati_setting_radio_buttons = (event.target as HTMLElement)?.parentElement ?? (() => { throw new Error("Element with class 'pati_setting_radio-buttons' not found"); })();
                let innerELMs_radio_button = ELM_pati_setting_radio_buttons.getElementsByClassName("pati_setting_radio-button");

                //クリックしたら、他のボタンをオフにする。オフになったとき色も変える
                console.log(innerELMs_radio_button)
                for (let j = 0; j < innerELMs_radio_button.length; j++) {
                    innerELMs_radio_button[j].classList.remove("on");
                }
                //クリックしたボタンがオンの場合はオフにし、オフの場合はオンにする
                ELM_radio_button.classList.toggle("on");
                this.pati_setting_mode = ELM_radio_button.innerText as PatiMode;

                //todo:ここでnow_onomatopoeia_actionを取得し設定
                if (["パク","パチ","ぴょこ"].includes(this.pati_setting_mode)){
                    this.reflectOnItemToNowOnomatopoeiaAction(this.pati_setting_mode as "パク" | "パチ" | "ぴょこ");
                }
                //全ての開閉状態を反映する
                this.reflectOnomatopoeiaActionViewStateToHumanModel();
            });
        }
    }

    /**
     * @param {"パク" | "パチ" | "ぴょこ"} onomatopoeia_mode
     * @param {"on" | "off"} on_off
     */
    setOnomatpeiaModeButtonOnOff(onomatopoeia_mode:"パク" | "パチ" | "ぴょこ", on_off:"on" | "off"): void {
        // debugger;
        let ELMs_radio_button = this.ELM_accordion_item_name.getElementsByClassName("pati_setting_radio-button") as HTMLCollectionOf<HTMLElement>;
        console.log(ELMs_radio_button)
        for (let i = 0; i < ELMs_radio_button.length; i++) {
            let ELM_radio_button = ELMs_radio_button[i];
            if (ELM_radio_button.innerText == onomatopoeia_mode){
                if (on_off == "on"){
                    ELM_radio_button.classList.add("on");
                } else {
                    ELM_radio_button.classList.remove("on");
                }
            } else {
                ELM_radio_button.classList.remove("on");
            }
        }
    }

    /**
     * 今のアコーディオンの中身の状態を取得し、オンになっているものをnow_onomatopoeia_actionに反映する。オフになっているものは削除する。
     * なので先に今のアコーディオンに入っているパーツをすべて削除し、その後に反映する
     */
    reflectOnItemToNowOnomatopoeiaAction(onomatopoeia_action_mode:PatiMode): void {
        if (["パク","パチ","ぴょこ"].includes(onomatopoeia_action_mode) == false){
            return;
        }

        let content_status_dict = this.getContentStatusDict()
        //now_onomatopoeia_actionからこのアコーディオンのパーツを削除
        let all_content_list = Object.keys(content_status_dict);
        for (let content of all_content_list){
            let part_path = {
                folder_name: this.name_acordion,
                file_name: content
            }
            this.chara_human_body_manager.now_onomatopoeia_action[onomatopoeia_action_mode] = this.chara_human_body_manager.now_onomatopoeia_action[onomatopoeia_action_mode].filter(
                (path) => this.chara_human_body_manager.isEquivalentPartsPath(path,part_path) == false
                );
        }

        //"on"を持つキーを取得
        let on_content_list = Object.keys(content_status_dict).filter((key) => content_status_dict[key] == "on");
        for (let on_content of on_content_list){
            let part_path = {
                folder_name: this.name_acordion,
                file_name: on_content
            }
            this.chara_human_body_manager.now_onomatopoeia_action[onomatopoeia_action_mode].push(part_path);
        }

        this.chara_human_body_manager.setLipSyncModeToPakuPaku(onomatopoeia_action_mode)
        
    }

    reflectOnomatopoeiaActionViewStateToHumanModel(){
        for (const [key, value] of Object.entries(this.accordion_content_handler_list)){
            
            const pati_setting_toggle_event_object = /**@type {PatiSettingToggleEventObject} */(value.pati_setting_toggle_event_object);
            //オノマトペアクションリストのすべてと開閉を探索して、このパーツパスを削除
            pati_setting_toggle_event_object.removePartsPathFromOnomatopoeiaActionSetting();

            //オノマトペアクションリストの現在の選択アクションに対してこのパーツパスを追加
            const now_state = pati_setting_toggle_event_object.now_state;
            pati_setting_toggle_event_object.reflectOnomatopoeiaActionState(now_state);
        }
    }


    setOpenPatiSettingAction(){
        
        let ELM_pati_setting = this.html_doc.querySelector(".pati_setting");
        let ELM_radio_buttons = this.html_doc.querySelector(".pati_setting_radio-buttons");
        ELM_pati_setting?.addEventListener("click", (event) => {
            event.stopPropagation();
            ELM_radio_buttons?.classList.toggle("non_vissible");
        });
    }
    
    /**
     * 
     * @param {Event} event
     */
    handleEvent(event){
        console.log("AccordionItemがクリックされたよ",this.ELM)
        //clickイベントの場合。アコーディオンの開閉を行う
        if(event.type == "click"){
            var ELM_accordion_item = this.ELM
            console.log(ELM_accordion_item)
            if (this.statu_open_close == "close") {
                ELM_accordion_item.classList.replace("close", "open");
                this.statu_open_close = "open";
                // @ts-ignore
                ELM_accordion_item.querySelector(".accordion_contents").classList.remove("non_vissible");
            } else {
                ELM_accordion_item.classList.replace("open", "close");
                this.statu_open_close = "close";
                // @ts-ignore
                ELM_accordion_item.querySelector(".accordion_contents").classList.add("non_vissible");
            }
        }
        //hoverしたとき色を変える
        if(event.type == "mouseover"){
            console.log("mouseover")
            this.ELM.classList.add("hover");
        }
    }


    // /**
    //  * 
    //  * @param {string} image_name 
    //  */
    // imageStatusChange(image_name) {
    //     if (this.image_item_status[image_name] == "on") {
    //         this.image_item_status[image_name] = "off";
    //         this.changeELMAccordionContent(image_name)
    //         this.chara_human_body_manager.changeBodyPart(image_name,"off");
    //     } else {
    //         this.image_item_status[image_name] = "on";
    //         this.chara_human_body_manager.changeBodyPart(image_name,"on");
    //     }
    // }

    // /**
    //  * アコーディオンのエレメントの最新の状態をプロパティに反映する
    //  */
    // loadNowAccordionELMStatus(){
    //     //todo: コードが適当なので確認すること
    //     for (let i = 0; i < this.ELMs_accordion_content.length; i++) {
    //         let image_name = this.ELMs_accordion_content[i].id;
    //         this.image_item_status[image_name] = this.ELMs_accordion_content[i].value;
    //     }

    // }

    /**
     * 
     * @param {string} name_acordion 
     */
    setAccordionItemName(name_acordion){
        //accordion_item_nameを変更
        // "1_10_葵_10_素体"などが入るので、最初の"1_10_"などを削除し、途中の数字も削除
        //数字（\d+）とそれに続くアンダースコア（_*）をすべて削除します。その後、アンダースコアをスペースに置換します。
        const new_name_acordion = name_acordion.replace( /\d+_+/g, '').replace(/_/g, ' ');
        // @ts-ignore
        this.html_doc.querySelector(".accordion_item_name").querySelector(".name_string").innerText = new_name_acordion;
    }

    /**
     * 
     * @param {string} name_acordion 
     * @returns {[HTMLUListElement,Record<string, ContentButtonEventobject>]} ELM_accordion_contents,accordion_content_handler_list
     */
    createELMAccordionContents(name_acordion:string):[HTMLUListElement,Record<string, ContentButtonEventobject>] {
        //this.contents_name_listには画像の名前が入っている。ELM_accordion_contentを複製してELM_accordion_contentsに追加する。
        let ELM_accordion_contents = this.html_doc.querySelector(".accordion_contents") as HTMLUListElement;
        const ELM_accordion_content = this.html_doc.querySelector(".accordion_content") as HTMLLIElement;

        let accordion_content_handler_list:Record<string,ContentButtonEventobject> = {};
        for (let i = 0; i < this.contents_name_list.length; i++) {
            //ELM_accordion_contentを複製
            let ELM_accordion_content_clone = ELM_accordion_content.cloneNode(true) as HTMLLIElement;
            // ELM_accordion_content_clone.innerText = this.contents_name_list[i];
            ELM_accordion_content_clone.getFirstHTMLElementByClassName("accordion_content_name_string").innerText = this.contents_name_list[i];
            //画像の名前から、画像のパスを取得
            //let image_path = this.chara_human_body_manager.map_body_parts_info.get(name_acordion)["imgs"].get(this.contents_name_list[i]);
            const image_name = this.contents_name_list[i];
            //アコーディオンの中身のボタンにイベントハンドラーを追加
            let content_button_event_object = new ContentButtonEventobject(image_name, "off", ELM_accordion_content_clone,this);
            ELM_accordion_content_clone.addEventListener("click", content_button_event_object);
            ELM_accordion_content_clone.classList.remove("sample");

            let ELM_accordion_content_pati_setting_toggle_button = ELM_accordion_content_clone.getFirstHTMLElementByClassName("accordion_content_pati_setting_toggle_button");
            let pati_setting_toggle_button_event_object = new PatiSettingToggleEventObject(ELM_accordion_content_pati_setting_toggle_button, this, content_button_event_object, this.humanTab);

            //アコーディオンの中身を追加
            ELM_accordion_contents.appendChild(ELM_accordion_content_clone);
            //console.log(ELM_accordion_content_clone);
            accordion_content_handler_list[image_name] = content_button_event_object;
        }
        
        // @ts-ignore html_docからsampleクラスを持つ要素を削除
        this.html_doc.querySelector(".sample").remove();
        

        return [ELM_accordion_contents,accordion_content_handler_list];
    }

    getContentStatusDict(): Record<string,"on"|"off">{
        /** @type {Record<string,"on"|"off">} */
        var item_status_dict = {};
        for (const [key, value] of Object.entries(this.accordion_content_handler_list)){
            item_status_dict[key] = value.on_off;
        }
        return item_status_dict;
    }

    /**
     * @param {Record<string,"on"|"off">} image_item_status
     * @returns {number}
     */
    countOnContentButton(image_item_status: Record<string,"on"|"off"> ): number{
        var count = 0;
        for (const [key, value] of Object.entries(image_item_status)){
            if (value == "on"){
                count += 1;
            }
        }
        return count;
    }

    /**
     * ONになっているボタンがあるかどうかをチェックし、アコーディオンのcssクラスを変える
     */
    checkHasOnContentButton():void{
        // console.log("checkHasOnContentButtonが動いた: " + new Date());
        const image_item_status = this.getContentStatusDict();
        const count_on_content_button = this.countOnContentButton(image_item_status);
        const ELM_accordion_item_name = this.ELM_accordion_item_name;
        // console.log(this.ELM_accordion_contents);
        // console.log(this.html_doc);
        // console.log(ELM_accordion_item_name);
        if (count_on_content_button > 0){
            if (ELM_accordion_item_name.classList.contains("has_on_content_button") == false){
                ELM_accordion_item_name.classList.add("has_on_content_button");
            }
        } else {
            if (ELM_accordion_item_name.classList.contains("has_on_content_button") == true){
                ELM_accordion_item_name.classList.remove("has_on_content_button");
            }
        }
    }
    /**
     * @param {string} image_name 
     */
    setBodyPartImage(image_name:string) {
        this.accordion_content_handler_list[image_name].clickEvent();
    }

    /** 
     * @param {string} content_name
     * @param {"on"|"off"} on_off
     */
    setGroupButtonOnOff(content_name:string, on_off:"on"|"off"): void{
        if (content_name != ""){
            const accordion_content_handler = this.accordion_content_handler_list[content_name];
            accordion_content_handler.setButtonOnOff(on_off);
        } else {
            this.setAllButtonOff();
        }
    }

    setAllButtonOff():void{
        for (const [key, value] of Object.entries(this.accordion_content_handler_list)){
            value.setButtonOnOff("off");
        }
    }

}

export class PatiSettingToggleEventObject{
    humanTab: IHumanTab;
    ELM_accordion_content_pati_setting_toggle_button:HTMLElement;
    parent_accordion_item_instance:AccordionItem;
    human_body_manager:HumanBodyManager2;
    image_name:string;
    now_state:"open"|"close" = "open";
    content_button_event_object:ContentButtonEventobject;

    constructor(
        ELM_accordion_content_pati_setting_toggle_button:HTMLElement, 
        parent_accordion_item_instance:AccordionItem,
        content_button_event_object:ContentButtonEventobject,
        humanTab:IHumanTab
    ){
        this.humanTab = humanTab;
        this.ELM_accordion_content_pati_setting_toggle_button = ELM_accordion_content_pati_setting_toggle_button;
        this.parent_accordion_item_instance = parent_accordion_item_instance;
        this.human_body_manager = parent_accordion_item_instance.chara_human_body_manager;
        this.ELM_accordion_content_pati_setting_toggle_button.addEventListener("click",this);
        this.image_name = content_button_event_object.image_name;
        this.content_button_event_object = content_button_event_object;
        this.content_button_event_object.bindPatiSettingToggleEventObject(this);
        this.now_state = this.pullInitStateFromDataStorage();
    }

    handleEvent(event:Event){
        //下のボタンにイベントを伝えない
        event.stopPropagation();
        //イベント
        if (this.ELM_accordion_content_pati_setting_toggle_button?.classList.contains("open") == true){
            this.setButtonOpenClose("close");
        } else {
            this.setButtonOpenClose("open");
        }
        this.reflectOnomatopoeiaActionState(this.now_state);
        
    }

    setButtonOpenClose(open_close: "open" | "close"){
        if (open_close == "open"){
            this.ELM_accordion_content_pati_setting_toggle_button?.classList.replace("close","open");
            this.ELM_accordion_content_pati_setting_toggle_button.innerText = "開";
        } else if (open_close == "close"){
            this.ELM_accordion_content_pati_setting_toggle_button?.classList.replace("open","close");
            this.ELM_accordion_content_pati_setting_toggle_button.innerText = "閉";
        }
        this.now_state = open_close;
    }

    reflectOnomatopoeiaActionState(open_close: "open" | "close"){
        //パチパク設定のモードによって、human_body_managerのプロパティを変える
        const parts_path:PartsPath = {
            folder_name: this.parent_accordion_item_instance.name_acordion,
            file_name: this.image_name
        }
        console.log(this.parent_accordion_item_instance.pati_setting_mode)
        if (this.parent_accordion_item_instance.pati_setting_mode == "口"){
            
        } else if (["パク","パチ","ぴょこ"].includes(this.parent_accordion_item_instance.pati_setting_mode)){
            console.log("パチパク設定のモードによって、human_body_managerのプロパティを変える")
            
            const mode:"パク"|"パチ"|"ぴょこ" = this.parent_accordion_item_instance.pati_setting_mode as "パク"|"パチ"|"ぴょこ";
            if (open_close == "open"){
                //開候補リストに登録
                this.human_body_manager.setToOnomatopoeiaActionSetting(mode,"開候補", parts_path)
                this.human_body_manager.removeFromOnomatopoeiaActionSetting(mode,"閉", parts_path)
            } else if (open_close == "close"){
                this.human_body_manager.removeFromOnomatopoeiaActionSetting(mode,"開候補", parts_path)
                this.human_body_manager.setToOnomatopoeiaActionSetting(mode,"閉", parts_path)
            }
        } else if (this.parent_accordion_item_instance.pati_setting_mode == "無"){
            
        }

        //新しい状態をサーバーに送信する
        this.sendOnomatopoeiaNewStateToDataStorage();
    }

    sendOnomatopoeiaNewStateToDataStorage(){
        /**
         * onomatopoeia_action_settingの新しい状態をサーバーに送信する.
         * サーバー側でデータを保存するためにはinit_image_infoに到達するための情報が必要。
         */
        const data = {
            "characterModeState":this.humanTab.characterModeState?.toDict(),
            "chara_name":this.human_body_manager.char_name,
            "front_name":this.human_body_manager.front_name,
            "pati_setting":this.human_body_manager.onomatopoeia_action_setting,
            "now_onomatopoeia_action":this.human_body_manager.now_onomatopoeia_action,
        }

        console.log("パチパク設定データ",data)

        //Postで送信する
        const url = `http://${GlobalState.localhost}:${GlobalState.port}/pati_setting`
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })

    }

    /** todo: 未実装。データストレージから初期状態を取得する
     * @returns {"open"|"close"}
     */
    pullInitStateFromDataStorage(): "open" | "close"{
        return "open";
    }

    removePartsPathFromOnomatopoeiaActionSetting(){
        for (let mode of ["パク","パチ","ぴょこ"]){
            const parts_path = {
                folder_name: this.parent_accordion_item_instance.name_acordion,
                file_name: this.image_name
            }
            this.human_body_manager.removeFromOnomatopoeiaActionSetting(mode as "パク"|"パチ"|"ぴょこ" ,"開候補", parts_path)
            this.human_body_manager.removeFromOnomatopoeiaActionSetting(mode as "パク"|"パチ"|"ぴょこ" ,"閉", parts_path)
        }
    
    }

}
       

export class ContentButtonEventobject{

    image_name:string;
    on_off:"on"|"off";
    ELM_accordion_content:HTMLElement;
    parent_accordion_item_instance:AccordionItem;
    chara_human_body_manager:HumanBodyManager2;
    pati_setting_toggle_event_object:PatiSettingToggleEventObject;

    /**
     * 各コンテンツのボタンのイベントハンドラーに追加するクラス
     * このクラスとコンテンツボタンはAccordionContent.createELMAccordionContents一対一で作成される。
     */
    constructor(image_name:string, on_off:"on"|"off", ELM_accordion_content:HTMLElement ,parent_accordion_item_instance:AccordionItem){
        this.image_name = image_name;
        this.on_off = on_off;
        this.ELM_accordion_content = ELM_accordion_content;
        this.parent_accordion_item_instance = parent_accordion_item_instance;
        this.chara_human_body_manager = parent_accordion_item_instance.chara_human_body_manager;
        //このコンテンツが最初からオンになってるかどうかをチェックする
        //this.checkInitContentStatus();
        this.checkContentStatus();
    }

    handleEvent(event:Event): void{
        //clickイベントの場合
        // console.log("ContentButtonEventobjectクリックしたよ")
        if(event.type == "click"){
            this.clickEvent();
        }
        //hoverしたとき色を変える
        if(event.type == "mouseover"){
            this.ELM_accordion_content.classList.add("hover");
        }
    }

    clickEvent(){
        // console.log("ContentButtonEventobjectクリックしたよ")
        const accordion_name = this.parent_accordion_item_instance.name_acordion;
        //ボタンの色を変え,プロパティのデータを変える
        // console.log(this.ELM_accordion_content);
        if(this.on_off == "off"){
            this.ELM_accordion_content.classList.add("on_accordion_content");
            this.chara_human_body_manager.changeBodyPart(accordion_name,this.image_name,"on");
            this.on_off = "on";
            //他のボタンでonになっているものをoffにする
            if (this.parent_accordion_item_instance.radio_mode == true) {
                for (const [key, value] of Object.entries(this.parent_accordion_item_instance.accordion_content_handler_list)){
                    // console.log(key,value)
                    if (key != this.image_name){
                        value.ELM_accordion_content.classList.remove("on_accordion_content");
                        value.parent_accordion_item_instance.chara_human_body_manager.changeBodyPart(accordion_name,key,"off");
                        value.on_off = "off";
                    }
                }
            }
            // now_onomatopoeia_actionを更新。パチパク設定のモードがパク、パチ、ぴょこの場合のみ反映される
            this.parent_accordion_item_instance.reflectOnItemToNowOnomatopoeiaAction(this.parent_accordion_item_instance.pati_setting_mode);

        } else {
            this.ELM_accordion_content.classList.remove("on_accordion_content");
            this.chara_human_body_manager.changeBodyPart(accordion_name,this.image_name,"off");
            this.on_off = "off";
            // now_onomatopoeia_actionを更新。パチパク設定のモードがパク、パチ、ぴょこの場合のみ反映される
            this.parent_accordion_item_instance.reflectOnItemToNowOnomatopoeiaAction(this.parent_accordion_item_instance.pati_setting_mode);
        }
        this.parent_accordion_item_instance.checkHasOnContentButton();
    }

    setButtonOnOff(on_off:"on"|"off"): void{
        const accordion_name = this.parent_accordion_item_instance.name_acordion;
        if (on_off == "on"){
            this.ELM_accordion_content.classList.add("on_accordion_content");
            this.chara_human_body_manager.changeBodyPart(accordion_name,this.image_name,"on");
            this.on_off = "on";
            //他のボタンでonになっているものをoffにする
            if (this.parent_accordion_item_instance.radio_mode == true) {
                for (const [key, value] of Object.entries(this.parent_accordion_item_instance.accordion_content_handler_list)){
                    console.log(key,value)
                    if (key != this.image_name){
                        value.ELM_accordion_content.classList.remove("on_accordion_content");
                        value.parent_accordion_item_instance.chara_human_body_manager.changeBodyPart(accordion_name,key,"off");
                        value.on_off = "off";
                    }
                }
            }
        } else {
            this.ELM_accordion_content.classList.remove("on_accordion_content");
            this.chara_human_body_manager.changeBodyPart(accordion_name,this.image_name,"off");
            this.on_off = "off";
        }
        this.parent_accordion_item_instance.checkHasOnContentButton();
    }

    /**
     * @returns {void}
     */
    checkContentStatus(){
        //HumanBodyManager2のプロパティのデータとアコーディオンの状態を比較して、アコーディオンの状態を変える
        const accordion_name = this.parent_accordion_item_instance.name_acordion;
        const on_off = this.chara_human_body_manager.getImgStatus(accordion_name,this.image_name);
        if (on_off == "on"){
            this.ELM_accordion_content.classList.add("on_accordion_content");
            this.on_off = "on";
        } else {
            this.ELM_accordion_content.classList.remove("on_accordion_content");
            this.on_off = "off";
        }
    }

    /**オノマトペアクションコントローラーをバインドする
     * @param {PatiSettingToggleEventObject} pati_setting_toggle_event_object
     */
    bindPatiSettingToggleEventObject(pati_setting_toggle_event_object){
        this.pati_setting_toggle_event_object = pati_setting_toggle_event_object;   
    }
}

export class BodyCombinationAccordionManager{

    human_body_manager:HumanBodyManager2;
    VoiroAISetting:VoiroAISetting;
    ELM_combination_box:HTMLElement;
    ELM_combination_name:HTMLElement;
    ELM_combination_candidate:HTMLElement;
    ELM_now_combination_name:HTMLElement;
    /** 
     * 組み合わせ名のアコーディオンの開閉状態を管理するMap。番号でも状態を取得したいのでMapを使う。オンのパターンの名前だけだとそれができないので。
     * todo: 未使用プロパティ
     */
     combination_box_status:ExtendedMap<string, "on" | "off">;
    conbination_contents:ExtendedMap<string,CombinationContent>;

    
    /**
     * VoiroAISetting.ELM_combination_nameを押したらアコーディオンが開いて、human_body_manager.pose_patternsの組み合わせ名が全て表示される
     * キャラの組み合わせ名を選択するアコーディオンを管理するクラス
     */
    constructor(human_body_manager:HumanBodyManager2, VoiroAISetting:VoiroAISetting, ELM_combination_box:HTMLElement, ELM_combination_name:HTMLElement, ELM_combination_candidate:HTMLElement){
        this.human_body_manager = human_body_manager;
        this.VoiroAISetting = VoiroAISetting;
        this.ELM_combination_box = ELM_combination_box;
        console.log("bcamを作成した",this.ELM_combination_box)
        this.ELM_now_combination_name = ELM_combination_name;
        this.ELM_combination_candidate = ELM_combination_candidate;
        this.combination_box_status = new ExtendedMap(); 
        this.conbination_contents = new ExtendedMap();
        console.log("setAllCombinationを呼び出す")
        this.setAllCombination()
    }

    /**
     * @param {Event} event
     * @returns {void}
     */
    handleEvent(event:Event): void{
        if(event.type == "click"){
            console.log("BodyCombinationAccordionManagerがクリックされたよ")
            console.log(this)
            console.log(this.ELM_combination_box)
            if (this.ELM_combination_box.classList.contains("close") == true){
                this.ELM_combination_box.classList.replace("close","open");
                this.setCombinationCandidateVisivility("open");
            } else {
                this.ELM_combination_box.classList.replace("open","close");
                this.setCombinationCandidateVisivility("close");
            }
            
        }
    }

    getCombinationBoxStatus(combination_name:string): "on" | "off"{
        return this.combination_box_status.get(combination_name)?? (() => {throw new Error("組み合わせ名が見つかりません")})();
    }
    setAllCombination(): void{
        //human_body_manager.pose_patternsの組み合わせ名を全てアコーディオンに追加する
        console.log( this.human_body_manager)
        const pose_patterns = this.human_body_manager.pose_patterns;
        console.log(pose_patterns)
        for (const [combination_name, combination_data] of pose_patterns.entries()){
            //settingとOnomatopeiaActionSettingは特別なのでアコーディオンに追加しない
            if (["setting","OnomatopeiaActionSetting","NowOnomatopoeiaActionSetting"].includes(combination_name) == true){
                continue;
            }
            console.log(combination_name)
            this.addCombination(combination_name);
        }
    }

    addCombination(combination_name:string): void{
        //human_body_manager.pose_patternsの組み合わせ名をアコーディオンに追加する
        var combination_content = new CombinationContent(combination_name, this, this.human_body_manager);
        var ELM_combination_content = combination_content.ELM_combination_name_button;
        ELM_combination_content.addEventListener("click",combination_content);
        this.ELM_combination_candidate.appendChild(ELM_combination_content);
        this.conbination_contents.set(combination_name,combination_content);
    }

    setCombinationCandidateVisivility(open_close: "open" | "close"): void{
        if (open_close == "open"){
            this.ELM_combination_candidate.classList.remove("non_vissible");
        } else {
            this.ELM_combination_candidate.classList.add("non_vissible");
        }
    }
}

export class CombinationContent{
    combination_name:string;
    body_combination_accordion_manager:BodyCombinationAccordionManager;
    human_body_manager:HumanBodyManager2;
    ELM_combination_name_button:HTMLElement;
    on_off:"on"|"off";
    /**
     * キャラの組み合わせ名を選択するアコーディオンの中身のパターンNのボタンなどを管理するクラス
     */
    constructor(combination_name:string, body_combination_accordion_manager:BodyCombinationAccordionManager, human_body_manager:HumanBodyManager2){
        this.combination_name = combination_name;
        this.body_combination_accordion_manager = body_combination_accordion_manager;
        this.human_body_manager = human_body_manager;
        
        this.ELM_combination_name_button = this.createELMCombinationNameButton();
        this.ELM_combination_name_button.addEventListener("click",this);
        this.on_off = "off";

    }
    
    /**
     * クリックした時に
     * 1:AccordionCombinationのELM_now_combination_nameのinnerTextを変更する
     * 2:VoiroAISettingの各アコーディオンのボタンをクリックするイベント発生さえて以下を実現する。
     * - human_body_managerのpose_patternを変更する
     * - human_body_managerのbody_partを変更する
     * 
     * HumanBodyManager2に対応させやすいようにするためにも
     * - AccordionCombinationがVoiroidAISettingを操作し、VoiroidAISettingがHumanBodyManagerを操作するようにする
     * 今はHumanBodyManagerの操作者は
     * - 1:AccordionCombination
     * - 2:文章による口パク制御
     * - 3:人間がボタンをVoiroidAISettingのクリックしたとき
     * - 4:gptによる「手を上げる」などの操作。
     * がある。
     */
    handleEvent(event:Event){
        if(event.type == "click"){
            //AccordionCombinationのELM_now_combination_nameのinnerTextを変更する
            this.body_combination_accordion_manager.ELM_now_combination_name.innerText = this.combination_name;
            //VoiroAISettingの各アコーディオンのボタンをクリックするイベント発生させて以下を実現する。
            //human_body_managerのpose_patternを変更する
            //human_body_managerのbody_partを変更する
            console.log("CombinationContentがクリックされたよ,ボタン名＝",this.combination_name,"現在の状態:",this.human_body_manager.pose_patterns)
            let combination_data = this.getCombinationData() ?? (() => {throw new Error("組み合わせデータが見つかりません")})();
            for (const [body_group, part_candidate_info] of combination_data.entries()){
                //part_candidate_info = {10_体:"on"}のようなjson
                // console.log(body_group," なのだ ",part_candidate_info,"を適用する。現在の状態:",this.human_body_manager.pose_patterns)
                //part_candidate_info = {10_体:"on"}のようなjsonのキーと値を取得する
                for (const [image_name, on_off] of Object.entries(part_candidate_info)){
                    // console.log(image_name, on_off)
                    this.body_combination_accordion_manager.VoiroAISetting.setGroupButtonOnOff(body_group, image_name, on_off);
                }
            }
        }
        console.log("コンビネーション適用完了！現在の状態:",this.human_body_manager.pose_patterns)
    }

    createELMCombinationNameButton(){
        var ELM_combination_name_button = document.createElement("li");
        ELM_combination_name_button.classList.add("combination_name_button","accordion_tab","off");
        ELM_combination_name_button.innerText = this.combination_name;
        console.log(ELM_combination_name_button);
        return ELM_combination_name_button;
    }

     getCombinationData(){
        const pose_pattern = this.human_body_manager.getPosePattern(this.combination_name);
        return pose_pattern;
    }
}

/**
 * GPTの設定を管理するクラス
 * got_settingエレメントをクリックすると開く。
 * gptのモードが列挙されたボタンがある。
 * 
 * 選択したモードは各キャラのMessageBoxとMessageBoxMabagerに送信され、すべてのキャラのGPTのモードが1元管理される。
 */
export class GPTSettingButtonManagerModel {

    //モード名：on_off のMap
    gpt_setting_status:ExtendedMap<string,"on"|"off">;

    /** todo
     * モード名：ボタンのDOM
     **/
    Map_ELM_gpt_setting_button:ExtendedMap<string,HTMLElement>;
    message_box:MessageBox;
    front_name :string;
    gpt_mode_name_list:string[];
    ELM_gpt_setting:HTMLUListElement;
    gpt_mode_accordion_open_close_button:HTMLElement;
    human_gpt_routine_ws_dict:Record<string, ExtendedWebSocket> = {};

    constructor(front_name:string, message_box:MessageBox, gpt_mode_name_list:string[]) {
        this.front_name = front_name;
        this.message_box = message_box;
        this.gpt_mode_name_list = gpt_mode_name_list;

        const human_tab:Element = this.message_box.message_box_elm.closest(".human_tab") ?? (() => {throw new Error("human_tabが見つかりません")})();
        this.ELM_gpt_setting = human_tab.querySelector(".gpt_setting") as HTMLUListElement;

        this.gpt_setting_status = this.getGPTSettingStatus(gpt_mode_name_list);
        this.Map_ELM_gpt_setting_button = this.getMapELMGPTSettingButton(gpt_mode_name_list);
        this.Map_ELM_gpt_setting_button.forEach((value, key, map) => {
            let ELM_gpt_setting_button = value;
            const mode_name = key;
            ELM_gpt_setting_button.addEventListener("click", (/** @type {Event} */ event) => { 
                this.clickEvent(event, mode_name);
            });
        });
        this.gpt_mode_accordion_open_close_button = (this.ELM_gpt_setting.querySelector(".gpt_mode_accordion_open_close_button")) ?? (() => {throw new Error("gpt_mode_accordion_open_close_buttonが見つかりません")})();
        console.log("gptクリックいべんとを追加する")
        this.gpt_mode_accordion_open_close_button.addEventListener("click", this.open_closeAcordion.bind(this));

        //ELM_gpt_settingからfocusが外れたときに、gpt_mode_accordion_open_close_buttonをcloseにする
        this.ELM_gpt_setting.addEventListener("focusout", this.closeAccordion.bind(this));
    }

    
    getGPTSettingStatus(gpt_mode_name_list:string[] ): ExtendedMap<string,"on"|"off"> {
        let gpt_setting_status = new ExtendedMap<string,"on"|"off">();
        for (let i = 0; i < gpt_mode_name_list.length; i++) {
            gpt_setting_status.set(gpt_mode_name_list[i], "off");
        }
        return gpt_setting_status;
    }

    getMapELMGPTSettingButton(gpt_mode_name_list:string[] ) :ExtendedMap<string,HTMLElement>{
        let Map_ELM_gpt_setting_button = new ExtendedMap<string,HTMLElement>();
        for (let i = 0; i < gpt_mode_name_list.length; i++) {
            let ELM_gpt_setting_button = this.createELMGPTSettingButton(gpt_mode_name_list[i]);
            Map_ELM_gpt_setting_button.set(gpt_mode_name_list[i], ELM_gpt_setting_button);
        }
        return Map_ELM_gpt_setting_button;
    }

    createELMGPTSettingButton(mode:string): HTMLElement {
        //<li class="bar_button gpt_mode" style="display: ;">off</li> などを作成する
        let ELM_gpt_setting_button = document.createElement("li");
        ELM_gpt_setting_button.classList.add("bar_button", "gpt_mode", "off", "non_vissible");
        ELM_gpt_setting_button.innerText = mode;
        //human_tabからgpt_settingに追加する
        this.ELM_gpt_setting.appendChild(ELM_gpt_setting_button);
        return ELM_gpt_setting_button;
    }

    open_closeAcordion():void {
        console.log("open_closeAcordionが呼ばれた")
        if (this.gpt_mode_accordion_open_close_button.classList.contains("close") == true) {
            this.openAccordion();
        } else {
            this.closeAccordion();
        }
    }
    closeAccordion() :void {
        this.gpt_mode_accordion_open_close_button.classList.replace("open", "close");
        this.Map_ELM_gpt_setting_button.forEach((value, key, map) => {
            let ELM_gpt_setting_button = value;
            ELM_gpt_setting_button.classList.add("non_vissible");
        });
    }

    openAccordion() :void {
        this.gpt_mode_accordion_open_close_button.classList.replace("close", "open");
        this.Map_ELM_gpt_setting_button.forEach((value, key, map) => {
            let ELM_gpt_setting_button = value;
            ELM_gpt_setting_button.classList.remove("non_vissible");
        });
    }

    clickEvent(event: Event, mode:string): void {
        console.log("GPTSettingButtonManaerModelがクリックされたよ")
        console.log(event, mode)
        this.radioChangeGPTSettingStatus(mode);
        this.radioChangeButtonView(mode);
        this.sendGPTSettingStatus(mode);
        this.sendGPTSettingStatus2Server(mode);
        if (mode == "individual_process0501dev") {
            alert("individual_process0501devがクリックされた")
            this.startGptRoutine();
        }
    }

    radioChangeGPTSettingStatus(target_mode:string): void {
        this.gpt_mode_name_list.forEach(
            (mode) => {
                if (mode == target_mode) {
                    this.setGPTSettingStatus(mode, "on");
                } else {
                    this.setGPTSettingStatus(mode, "off");
                }
            }
        )
    }

    setGPTSettingStatus(mode:string ,on_off:"on"|"off"):void {
        this.gpt_setting_status.set(mode, on_off);
        if (on_off == "on") {
            this.message_box.setGptMode(mode);
        }
    }

    radioChangeButtonView(mode:string):void {
        this.gpt_mode_name_list.forEach(
            (mode) => {
                if (this.gpt_setting_status.get(mode) == "on") {
                    this.setButtonView(mode, "on");
                    this.gpt_mode_accordion_open_close_button.innerText = `GPT : ${mode}`;
                } else {
                    this.setButtonView(mode, "off");
                }
            }
        )
    }

    setButtonView(mode:string, on_off:"on"|"off"):void {
        const ELM_gpt_setting_button = this.Map_ELM_gpt_setting_button.get(mode) ?? (() => {throw new Error("ELM_gpt_setting_buttonが見つかりません")})();
        if (on_off == "off") {
            ELM_gpt_setting_button.classList.remove("on");
            ELM_gpt_setting_button.classList.add("off");
        } else {
            ELM_gpt_setting_button.classList.remove("off");
            ELM_gpt_setting_button.classList.add("on");
        }
    }

    /**
     * @param {string} mode
     * @returns {void}
     */
    sendGPTSettingStatus(mode) {
        this.message_box.gpt_mode = mode;
    }

    /**
     * @param {string} mode
     * @returns {void}
     */
    sendGPTSettingStatus2Server(mode) { 
        //websocketを作成
        var ws_gpt_mode_sender = new WebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/gpt_mode`)
        ws_gpt_mode_sender.onopen =  ( _ ) => {
            const data = {[this.front_name]: mode}
            console.log("gpt_modeが開かれた。このデータを送る。", mode)
            ws_gpt_mode_sender.send(JSON.stringify(data));
            ws_gpt_mode_sender.close();
        }
        //websocketを閉じる
        ws_gpt_mode_sender.onclose = function (event) {
            console.log("gpt_modeが閉じられたよ")
        }
        //サーバーからメッセージを受け取ったとき。今は使ってない。
        ws_gpt_mode_sender.onmessage = function (event) {
            console.log("gpt_modeからメッセージを受け取ったよ")
            console.log(event.data)
            ws_gpt_mode_sender.close();
        }
    }
    startGptRoutine() {
        alert("startGptRoutineが呼ばれた")
        const front_name = this.front_name;
        let ws_gpt_routine = new ExtendedWebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/gpt_routine/${front_name}`);
        ws_gpt_routine.onopen = (event) => {
            console.log("gpt_routineが開かれた")
        }
        ws_gpt_routine.onclose = (event) => {
            console.log("gpt_routineが閉じられた")
        }
        ws_gpt_routine.onmessage = (event) => {
            console.log("gpt_routineからメッセージを受け取った")
            console.log(event.data)
            GlobalState.messageQueue.push(event);
            console.log("messageQueue=",GlobalState.messageQueue,"messageQueueをpushしました","isProcessing=",GlobalState.isProcessing);
            processMessages();
            console.log("messageQueue=",GlobalState.messageQueue,"イベントを一つとりだした後のmessageQueueです");
        }
        this.human_gpt_routine_ws_dict[front_name] = ws_gpt_routine;
    }
}








function drawFillRectInOpratorCanvas(x,y,width,height,color,debug=false){
    if (debug == true){
        console.log("drawFillRectInOpratorCanvasが呼び出された");
        console.log("引数",{"x":x,"y":y,"width":width,"height":height,"color":color});

        let oprator_canvas = document.getElementsByClassName("operator_canvas")[0];
        let ctx = (oprator_canvas as HTMLCanvasElement).getContext('2d'); if (ctx == null){throw new Error("ctxがnullです。");}
        ctx.fillStyle = color;
        ctx.fillRect(x,y,width,height);
    }
}

function connect_ws() {
    GlobalState.ws = new WebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/ws/${GlobalState.client_id}`);

    GlobalState.ws.onmessage = function(event:MessageEvent) {
        GlobalState.messageQueue.push(event);
        console.log("messageQueue=",GlobalState.messageQueue,"messageQueueをpushしました","isProcessing=",GlobalState.isProcessing);
        processMessages();
        console.log("messageQueue=",GlobalState.messageQueue,"イベントを一つとりだした後のmessageQueueです");
    };

    GlobalState.ws.onclose = closeEventProcces_ws;
}

function closeEventProcces_ws(event) {
    console.log("wsが切断されました。再接続します。");
    //id = audio_ws_onclose_event の音声を取得し、存在すれば再生。
    var audio = document.getElementById("audio_ws_onclose_event");
    if (audio) {
        //audio.play();
    }
    setTimeout(connect_ws, 1000);
}

async function getClientId(): Promise<string> {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/id_create`);
        ws.onmessage = function(event) {
            console.log("data.id", event.data);
            ws.close();  // WebSocketの接続を閉じる
            resolve(event.data);
        };
        ws.onerror = function(error) {
            reject(error);
        };
    });
}

function chara_name2front_name(chara_name){
    //front2chara_nameのvalueがchara_nameと一致するkeyを取得する
    //この関数は、front2chara_nameオブジェクトのキーの中で、そのキーに対応する値がchara_nameと一致する最初のキーを返します。
    var front_name = Object.keys(GlobalState.front2chara_name).find(key => GlobalState.front2chara_name[key] === chara_name);
    if (front_name === undefined){
        //一致するキーがない場合は、"no_front_name"を返す
        return "no_front_name";
    }
    return front_name;
}

//キャラクターのあだ名を送り、キャラクターのパーツの画像のpathを受け取る
function humanWsOpen(){
    GlobalState.human_ws = new WebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/human/${GlobalState.client_id}`);
    GlobalState.human_ws.onmessage = receiveMessage;
    console.log("human_wsが接続されました。");
}



export class DragDropFile{
    humanTab:HumanTab
    get human_tab(): Element { return this.humanTab.component.element; }
    get human_window(): Element { return this.humanTab.humanWindow.component.element; }
    get human_name(): HTMLElement { return this.humanTab.humanName.component.element ; }
    human_images: Element
    target_voiceroid_front_name: string


    constructor(humanTab:HumanTab){
        this.humanTab = humanTab;
        this.human_images = this.human_tab.getElementsByClassName("human_images")[0];
        this.target_voiceroid_front_name = "????";
        this.human_tab.addEventListener("click", this);
        this.human_tab.addEventListener("drop", this);
        this.human_tab.addEventListener("dragover", this);

    }

    handleEvent(/** @type {DragEvent}*/event){
        //これがないと、ドラッグドロップができない
        event.preventDefault();

        if(event.type == "click"){
            console.log("ファイルがドラッグされています。")
            //POST確認
            fetch(`http://${GlobalState.localhost}:${GlobalState.port}/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({test_param: "testだよ茜ちゃん"})
            }).then(response => response.json())
            .then(data => {
                console.log(data);
            })
        } else if(event.type == "drop"){
            console.log("ファイルがドロップされました。")
            // ドロップされたファイルを取得する
            const files = event.dataTransfer?.files;

            if (files == undefined) {
                console.log("ファイルがありません。フォルダーは受け付けません。");
                return;
            }

            const response_mode = this.decideResponseMode()
            

            if (files.length == 1) {
                // ファイルが1つだけなら、ファイル名がどのボイロでも、今のウインドウの子のフォルダーに保存する
                const file = files[0];
                if (file.name.endsWith('.psd')) {
                    console.log("psdファイルです。サーバーに送ります。")

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('filename', file.name);
                    formData.append("response_mode", response_mode)
                    formData.append("front_name", this.target_voiceroid_front_name)

                    console.log(`response_mode: ${response_mode}`)

                    if (response_mode == "FrontName_needBodyParts") {
                        console.log("front_nameがあり、かつ、画像が表示されてないなら、サーバーはBodyPartsを返す")
                        fetch(`http://localhost:${GlobalState.port}/parserPsdFile}`, {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(json => {
                            const charaCreateData:CharaCreateData = json;
                            this.humanTab.createHuman(charaCreateData);

                        })
                        .catch(error => console.error(error));
                    } else if (response_mode == "FrontName_noNeedBodyParts") {
                        console.log("front_nameがあり、かつ、画像が表示されているなら、サーバーは何も返さない")
                        fetch(`http://localhost:${GlobalState.port}/parserPsdFile`, {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            //JavaScriptでは、オブジェクトからデータを抽出して新しい変数に格納するために、以下のようにデストラクチャリング（Destructuring）という機能を使用することができます。
                            // const { body_parts_iamges, init_image_info, front_name, char_name } = data;
                            
                        })
                        .catch(error => console.error(error));
                    } else if (response_mode == "noFrontName_needBodyParts") {
                        console.log("front_nameが空文字列なら、サーバーはファイル名からchar_nameを推測してBodyPartsを返す")
                        fetch(`http://localhost:${GlobalState.port}/parserPsdFile`, {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(json => {
                            const charaCreateData:CharaCreateData = json;
                            this.humanTab.createHuman(charaCreateData);

                        })
                        .catch(error => console.error(error));
                    }
                } else if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/gif") {
                    console.log("画像ファイルです。")
                    // 背景画像の場合、ELM_bg_imageの画像を変更する
                    console.log("背景画像です。")
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        this.humanTab.backGroundImages.addBackGroundImage(reader.result as string);
                    }
                } else if (file.name.endsWith('.json')) {
                    console.log("jsonファイルです。")
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = () => {
                        const json = JSON.parse(reader.result as string);
                        console.log(json);
                        if (json["front_name"]) {
                            this.setFrontname(json["front_name"]);
                        }
                    }
                } else if (file.name.endsWith('.csv')) {
                    console.log("csvファイルです。")
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = () => {
                        const csv = reader.result;
                        console.log(csv);
                        //csvの型チェック
                        try{
                            if (typeof csv == "string") {
                                const sentence_timeline = new sentenceTimeLineCreater(csv); 
                                const sentence_timeline_list = sentence_timeline.getSentenceTimeLine();
                            }
                        } catch (error) {
                            console.error(error)
                        }
                        
                    }
                } else {
                    console.log("ファイルが適切な形式ではありません。");
                }


            } else if (files.length > 1) {
                // ファイルが複数なら、ファイル名がどのボイロでも、今のウインドウの子のフォルダーに保存する

                // ファイルの検査。フォルダならdrop_enable=falseにする
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    this.checkFileType(file);
                }
            }

            // ファイルの検査。psdか画像ならdrop_enable=trueにする

        }
    }

    /**
     * 
     * @returns {string}
     */
    getFrontname(){
        return this.target_voiceroid_front_name;
    }

    setFrontname(/** @type {string}*/frontname){
        this.target_voiceroid_front_name = frontname;
    }

    checkFileType(/** @type {File}*/file){
        const file_type = file.type;
        if (file_type == "image/png" || file_type == "image/jpeg" || file_type == "image/gif") {
            return true;
        } else {
            return false;
        }
    }

    

    /**
     * front_nameが空文字列なら、サーバーはファイル名からchar_nameを推測してBodyPartsを返す
     * front_nameがあり、かつ、画像が表示されてないなら、サーバーはBodyPartsを返す
     * front_nameがあり、かつ、画像が表示されているなら、サーバーは何も返さない
     * @returns {"noFrontName_needBodyParts"|"FrontName_needBodyParts"|"FrontName_noNeedBodyParts"}
     */
    decideResponseMode(){

        if (this.target_voiceroid_front_name == "????") {
            return "noFrontName_needBodyParts"
        } else {
            //このhuman_tab内に画像があるかどうかを調べる
            const human_image_list = this.human_images.getElementsByClassName("human_image");
            if (human_image_list.length > 0) {
                return "FrontName_noNeedBodyParts"
            } else {
                return "FrontName_needBodyParts"
            }
        }
    }



}



/**
 * @typedef {Object} sentenceTimeLine
 * @property {Number} number
 * @property {String} sentence
 * @property {Number} start_time
 * @property {Number} end_time
 * @property {String} speaker 
 */

class sentenceTimeLineCreater{
    /** @type {string[][]}*/ csv_data
    /** @type {string[]}*/ header
    /** @type {Record<string,number>} */ key_num = {
        '番号': 0,
        'セリフ': 1,
        '開始時間': 2,
        '終了時間': 3,
        '話者': 4
    };
    /** @type {sentenceTimeLine[]} */ sentence_timeline_list
    /** */ 
    constructor(/** @type {string}*/csv){
        this.csv_data = this.csvToArray(csv);
        this.header = this.csv_data[0];
        //headerはkeyが書いてある。keyの番号を確認して更新。
        for (let i = 0; i < this.header.length; i++) {
            this.key_num[this.header[i]] = i;
        }
        const num = this.key_num;
        // 1行目はヘッダーなので、2行目からデータが始まる
        this.sentence_timeline_list = this.csv_data.slice(1).map((line) => {
            return {
                number: Number(line[num['番号']]),
                sentence: line[num['セリフ']],
                start_time: Number(line[num['開始時間']]),
                end_time: Number(line[num['終了時間']]),
                speaker: line[num['話者']]
            }
        });
        
    }

    /**
     * 
     * @param {string} csv 
     * @returns {string[][]}
     */
    csvToArray(/** @type {string}*/csv){
        const lines = csv.split('\n');
        const result: string[][] = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const cells = line.split(',');
            result.push(cells);
        }
        return result;
    }

    /**
     * @return {sentenceTimeLine[]}
     */
    getSentenceTimeLine(){
        return this.sentence_timeline_list;
    }
}


export class GlobalState {
    static message_box_manager:MessageBoxManager;
    static localhost = location.hostname;
    static port = "8010";
    static init_human_tab:HTMLLIElement;
    static messageQueue: MessageEvent[] = [];
    static isProcessing = false;
    static humans_list: Record<CharacterId, HumanBodyManager2> = {};
    static front2chara_name: Record<string, string> = {};
    static setting_info: Record<CharacterId, VoiroAISetting> = {};
    static first_human_tab;
    static drag_drop_file_event_list: DragDropFile[] = [];
    static client_id: string;
    static ws: WebSocket;
    static human_ws: WebSocket;
    static test = 0;

    static async initialize() {
        GlobalState.message_box_manager = new MessageBoxManager();
        GlobalState.init_human_tab = document.getElementsByClassName("tab human_tab")[0] as HTMLLIElement;
        addClickEvent2Tab(GlobalState.init_human_tab);
        GlobalState.first_human_tab = document.getElementsByClassName("tab human_tab")[0];
        
        console.log("ドラッグアンドドロップイベントを追加しました。");

        GlobalState.client_id = await getClientId();
        RequestAPI.client_id = GlobalState.client_id;
        RequestAPI.port = GlobalState.port; 
        RequestAPI.localhost = GlobalState.localhost;

        GlobalState.ws = new WebSocket(`ws://${GlobalState.localhost}:${GlobalState.port}/ws/${GlobalState.client_id}`);
        GlobalState.ws.onmessage = function(event) {
            GlobalState.messageQueue.push(event);
            console.log("messageQueue=", GlobalState.messageQueue, "messageQueueをpushしました", "isProcessing=", GlobalState.isProcessing);
            processMessages();
            console.log("messageQueue=", GlobalState.messageQueue, "イベントを一つとりだした後のmessageQueueです");
        };
        GlobalState.ws.onclose = closeEventProcces_ws;

        humanWsOpen();
    }
}

// メイン処理の開始

export async function main() {

    await GlobalState.initialize();
    GlobalState.drag_drop_file_event_list.push(new DragDropFile(GlobalState.message_box_manager.message_box_list[0].human_tab));
}




