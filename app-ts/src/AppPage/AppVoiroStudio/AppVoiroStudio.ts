import "../../../src/OldJs/css/CustomFont.css"
import "../../../src/OldJs/css/setting.css"
import "../../../src/OldJs/css/style.css"
import "../../../src/OldJs/css/voiro_AI_setting.css"

///@ts-check
import "../css/CustomFont.css";
import "../css/setting.css"
import "../css/style.css"
import "../css/voiro_AI_setting.css"
import { SpeechRecognition, SpeechRecognitionEvent, webkitSpeechRecognition } from "../../../src/Extend/webkitSpeechRecognition"; 
import { ExtendedWebSocket } from "../../Extend/extend";
import { ExtendedMap } from "../../Extend/extend_collections";
import { BodyUnitKey, BodyUnitValue, BodyUnitVariationImageInfo, BodyUnitVariationImages, BodyUnitVariationImagesMap, BodyUnitVariationKey, convertBodyUnitVariationImagesToMap, HumanBodyCanvasCssStylePosAndSize, HumanData, ImageInfo, InitImageInfo, PoseInfo, PoseInfoKey, PoseInfoMap } from "../../ValueObject/IHumanPart";

// const { promises } = require("fs");


function addClickEvent2Tab(human_tab_elm: HTMLElement) {
    // タブに対してクリックイベントを適用
    const tabs = human_tab_elm.getElementsByClassName('tab');
    human_tab_elm.addEventListener('click', tabSwitch.bind(human_tab_elm), false);
    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs[i] as HTMLElement;
        tab.addEventListener('click', tabSwitch.bind(tab), false);
    }
    // タブ識別用にdata属性を追加
    const num:Number = message_box_manager.message_box_list.length;
    human_tab_elm.setAttribute('data-tab_num', num);
    //メッセージボックスのサイズが変更された時のイベントを追加
    var message_box_elm = human_tab_elm.getElementsByClassName("messageText")[0] as HTMLTextAreaElement;
    const front_name = (human_tab_elm.getElementsByClassName("human_name")[0] as HTMLElement).innerText
    new MessageBox(message_box_elm,message_box_manager,num,human_tab_elm);
}

class VoiceRecognitioManager {
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
        if(VoiceRecognitioManager.instance = null){
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
            //userのキャラの名前を取得
            var user_elem = document.getElementsByClassName("tab user")[0];
            if (user_elem.parentElement == null) {return;}
            var user_char_name = (user_elem.parentElement.getElementsByClassName("human_name")[0] as HTMLElement).innerText;
            //user_char_nameのmessage_boxを取得
            var message_box = message_box_manager.message_box_dict.get(user_char_name);
            //message_boxにtextを追加
            message_box.sendMessage(text);
        }
    }
}


function tabSwitch(this: HTMLElement, event: Event): void {
    if (this.innerText == "+") {
        const humans_space: HTMLElement = document.getElementsByClassName('humans_space')[0] as HTMLElement;
        // 追加タブを追加
        const tab: HTMLElement = humans_space.querySelector(".init_tab") as HTMLElement;
        const clone: HTMLElement = tab.cloneNode(true) as HTMLElement;
        clone.classList.remove("init_tab");
        clone.classList.add("tab");
        (clone.getElementsByClassName('human_name')[0] as HTMLElement).innerText = "????";
        humans_space.append(clone);
        addClickEvent2Tab(clone);
        drag_drop_file_event_list.push(new DragDropFile(clone));
        //changeMargin()
    }else if(this.innerText == "x") {
        //削除ボタンが押された人のタブを削除
        let delete_target_element: HTMLElement | null  = this.parentNode?.parentNode as HTMLElement;
        delete_target_element?.remove()
        //changeMargin()
        //別のタブにアクティブを移す処理

        //ニコ生コメント受信を停止する。nikonama_comment_reciver_stopにfront_nameをfetchで送信する。
        const front_name = (delete_target_element.getElementsByClassName("human_name")[0] as HTMLElement).innerText;
        fetch(`http://${localhost}:${port}/nikonama_comment_reciver_stop/${front_name}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ front_name: front_name })
        })
        const char_name = front2chara_name[front_name]
        //設定タブを開いてるならエレメントを削除し、setting_infoからも削除
        console.log("設定タブを開いてるならエレメントを削除し、setting_infoからも削除")
        if (char_name in setting_info) {
            console.log(char_name+"setteng_infoにあるので削除")
            setting_info[char_name].ELM_accordion.remove();
            delete setting_info[char_name];
            
        }
        
        //このタブのキャラのデータを削除
        if (char_name in humans_list) {
            delete humans_list[char_name];
        }
        
        //message_box_managerからも削除
        message_box_manager.message_box_dict.delete(front_name);

    }
    else if (this.className.includes("human_name") && !this.className.includes("input_now")) {
        //iosの自動再生制限対策でid=audioのaudioタグを再生する
        /*var audio = document.getElementById('audio');
        audio.volume = 0;
        audio.play();*/
        //キャラの名前を選択できるようにプルダウンかinputを追加
        this.classList.add('input_now')
        let ELM_human_name = this;
        let human_tab = ELM_human_name.parentNode?.parentNode as HTMLElement;
        //this.innerText = ""
        let input = document.createElement("input")
        input.type = "text"
        input.enterKeyHint = "enter"
        //pc版
        input.addEventListener("keydown", function(event) 
        {
            console.log(this)
            if (event.key === "Enter") {
                //removeInputCharaNameイベントを解除する
                input.removeEventListener("blur", removeInputCharaName.bind(input));
                const human_name = input.value;
                registerHumanName(human_name, human_tab, ELM_human_name)
                sendHumanName(human_name)
                input.remove();
            }
        });
        //フォーカスが外れたときにinputを削除
        input.addEventListener("blur", removeInputCharaName.bind(input));
        ELM_human_name.appendChild(input);
        input.focus();
    }
    else if (this.innerText == "npc") {
        //npcの場合、userに変更され、他のuserはnpcに変更される
        
        //他のuserがあれば、npcに変更
        let user_elms = document.getElementsByClassName("tab user");
        if (user_elms.length > 0){
            let user:HTMLElement = user_elms[0] as HTMLElement;
            user.innerText = "npc";
            user.classList.remove("user");
            user.classList.add("npc");
            VoiceRecognitioManager.singlton().deleteEventOnEnd();
        }
        
        //自分はuserに変更
        this.innerText = "user";
        this.classList.remove("npc");
        this.classList.add("user");
        //音声認識を開始
        var vrm = VoiceRecognitioManager.singlton()
        vrm.user_number = 1;
        vrm.start();

        
    }
    else if (this.innerText == "user") {
        //音声認識を停止
        const vrm = VoiceRecognitioManager.singlton()
        vrm.deleteEventOnEnd();
        //自分はnpcに変更
        this.innerText = "npc";
        //classも変更
        this.classList.remove("user");
        this.classList.add("npc");
        vrm.user_number = 0;   
    }
    else if (this.innerText == "設定") {
        (event.target as HTMLElement)?.classList.add("setting_now")
        //設定画面を表示
        const front_name = ((this.parentNode as HTMLElement)?.getElementsByClassName("human_name")[0] as HTMLElement).innerText
        const char_name = front2chara_name[front_name]
        if (char_name in setting_info) {
            console.log(char_name+"setteng_infoにある")
            if (setting_info[char_name].ELM_accordion.classList.contains("vissible")){
                console.log("vissibleを削除",setting_info[char_name].ELM_accordion)
                setting_info[char_name].ELM_accordion.classList.remove("vissible")
                setting_info[char_name].ELM_accordion.classList.add("non_vissible")

            }else{
                console.log("vissibleを追加",setting_info[char_name].ELM_accordion)
                setting_info[char_name].ELM_accordion.classList.remove("non_vissible")
                setting_info[char_name].ELM_accordion.classList.add("vissible")
            }
        } else {
            console.log(char_name+"setteng_infoにない")
            const chara_human_body_manager = humans_list[char_name]
            var vas = new VoiroAISetting(chara_human_body_manager);
            humans_list[char_name].BindVoiroAISetting(vas);
            setting_info[char_name] = vas;
            setting_info[char_name].ELM_accordion.classList.add("vissible")



        }
        
    } else if (this.className.includes("gpt_setting")) {
        //gptの設定画アコーディオンを表示

    }
    else {
        //キャラ名の場合

    }
    //アクティブにする
    var active = document.getElementsByClassName('is-active')[0];
    if (active) {
    active.classList.remove('is-active');
    }
    this.classList.add('is-active');
    
}

/**
 * @param {string} human_name
 * @param {Element} human_tab
 * @param {HTMLElement} ELM_human_name
 */
function registerHumanName(human_name:string, human_tab:Element, ELM_human_name:HTMLElement) {
    let human_window = human_tab.getElementsByClassName("human_window")[0]
    //画像が送られてきたときに画像を配置して制御するためにhuman_windowにキャラの名前のタグを付ける。
    human_window.classList.add(`${human_name}`)
    //名前を格納
    ELM_human_name.innerText = human_name;
    ELM_human_name.classList.remove("input_now")
    
    //messageBoxにhuman_nameを格納
    //今のhuman_tabの番号を取得
    const tab_num = human_tab.getAttribute('data-tab_num');
    message_box_manager.linkHumanNameAndNum(human_name,tab_num)
}

function removeInputCharaName(this: HTMLElement,event:Event):void {
    //thisはinputがbindされている
    console.log("blur")
    let parent_elem = this.parentNode as HTMLElement
    parent_elem.classList.remove("input_now")
    console.log(this)
    this.remove();
}

class MessageBoxManager {

    /**  メッセージボックスのリスト*/ 
    message_box_list: MessageBox[]

    /** メッセージボックスの辞書。キーはキャラのfront_name、値はメッセージボックスのインスタンス。*/
    message_box_dict: ExtendedMap<string, MessageBox>

    /** @type {number} 監視しているメッセージボックスの番号を格納。-1なら監視していない。*/
    observe_target_num: number

    /** 監視対象のメッセージボックスの高さが変更されたときに、他のメッセージボックスの高さも変更するためのオブジェクト。*/
    resizeObserver: ResizeObserver

    /** @type キャラのgptモードの状態を格納する辞書。キーはキャラのfront_name、値はgptモードの状態。*/
    Map_all_char_gpt_mode_status : ExtendedMap<string, string>

    constructor() {
        this.message_box_list = [];
        this.message_box_dict = new ExtendedMap();
        this.observe_target_num = -1;
        this.resizeObserver = new ResizeObserver((entries) => {
            this.setHeight((entries[0].target as HTMLElement).style.height, this);
        });
        this.Map_all_char_gpt_mode_status = new ExtendedMap();
    }

    setMessageBox(message_box) {
        this.message_box_list.push(message_box);
        var assign_number = this.message_box_list.length - 1;
        return assign_number;
    }

    //１つのメッセージボックスの大きさが変更されたときに、他のメッセージボックスの大きさも変更する関数
    setHeight(height, changed_message_box) {
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
     * キャラのフロントネームとメッセージボックスを紐づける
     * @param {string} front_name 
     * @param {number} tab_num 
     */
    linkHumanNameAndNum(front_name,tab_num) {
        const message_box = this.message_box_list[tab_num];
        this.message_box_dict.set(front_name,message_box);
        message_box.front_name = front_name;
        message_box.setGptMode("off");
        const gpt_mode_name_list = ["off","individual_process0501dev","SimpleWait4","SimpleWait3.5","low","high","test"];
        message_box.gpt_setting_button_manager_model = new GPTSettingButtonManagerModel(front_name, message_box, gpt_mode_name_list)
    }

    /**
     * @param {string} front_name 
     * @param {string} gpt_mode 
     */
    setGptMode2AllStatus(front_name,gpt_mode) {
        this.Map_all_char_gpt_mode_status.set(front_name, gpt_mode);
    }

    getAllGptModeByDict() {
        const gpt_mode_dict = {};
        for (let [key, value] of this.Map_all_char_gpt_mode_status) {
            gpt_mode_dict[key] = value;
        }
        return gpt_mode_dict;
    }

    /**
     * @param {string} front_name
     * @return {MessageBox | null}
     * */
    getMessageBoxByFrontName(front_name) {
        //front_nameがfront2chara_nameにない場合はnullを返す
        if (front_name in front2chara_name) {
            return this.message_box_dict.get(front_name);
        } else {
            return null;
        }
    }

    getMessageBoxByCharName(char_name) {
        const front_name = chara_name2front_name(char_name);
        if (front_name == "no_front_name") {
            return null;
        }
        return this.message_box_dict.get(front_name);
    }

}


class MessageBox {
    //message_box単体のクラス
    public char_name: string;
    public front_name: string;
    public gpt_mode: string;
    public message_box_elm: HTMLTextAreaElement;
    public parent_ELM_input_area: HTMLElement|null
    public ELM_send_button: HTMLElement;
    public ELM_delete_button: HTMLElement;
    public message_box_manager: MessageBoxManager;
    public manage_num: number;
    public ws_nikonama_comment_reciver: WebSocket;
    public ws_youtube_comment_reciver: ExtendedWebSocket;
    public ws_twitch_comment_reciver: ExtendedWebSocket;
    /** @type {GPTSettingButtonManagerModel}*/ gpt_setting_button_manager_model;
    /** @type {HumanTab}*/ human_window;
    
   
    constructor(message_box_elm:HTMLTextAreaElement, message_box_manager:MessageBoxManager, manage_num:Number, human_tab_elm:HTMLElement) {
        this.char_name = "";
        this.front_name = "";
        this.gpt_mode = "";
        this.message_box_elm = message_box_elm;
        this.parent_ELM_input_area = this.message_box_elm.closest(".input_area");
        this.ELM_send_button = this.parent_ELM_input_area?.getElementsByClassName("send_button")[0] as HTMLElement;
        this.ELM_delete_button = this.parent_ELM_input_area?.getElementsByClassName("delete_button")[0] as HTMLElement;
        this.message_box_manager = message_box_manager;
        this.human_window = new HumanTab(human_tab_elm, this.front_name);
        //メッセージボックスマネージャーにこのメッセージボックスを登録
        this.manage_num = this.message_box_manager.setMessageBox(this)
        if(manage_num != this.manage_num) {
            alert("message_box_managerに登録された番号と、message_boxの番号が一致しません。")
        }
        //メッセージボックスの高さが変更されたときに、他のメッセージボックスの高さも変更するようにする
        this.message_box_elm.addEventListener('mousedown', this.startObsereve.bind(this));
        this.message_box_elm.addEventListener('mouseup', this.endObsereve.bind(this));
        
        this.ELM_send_button.onclick = async (event) => {
            await this.execContentInputMessage();
        };
        this.execContentInputMessage = this.execContentInputMessage.bind(this);
    }
    startObsereve() {
        this.message_box_manager.observe_target_num = this.manage_num;
        this.message_box_manager.resizeObserver.observe(this.message_box_elm);
    }
    endObsereve() {
        this.message_box_manager.observe_target_num = -1;
        this.message_box_manager.resizeObserver.unobserve(this.message_box_elm);
    }
    async execContentInputMessage() {
        const front_name = this.front_name;
        const message = this.message_box_elm.value;
        //messageに「コメビュモード:{room_id}」と入力されている場合
        if (message.includes("コメビュモード:")) {
            //コメビュモードに入る
            const room_id = message.split(":")[1];
            //websocketを開く
            this.ws_nikonama_comment_reciver = new WebSocket(`ws://${localhost}:${port}/nikonama_comment_reciver/${room_id}/${front_name}`);
            this.ws_nikonama_comment_reciver.onmessage = this.receiveNikoNamaComment.bind(this);
            //メッセージボックスの中身を削除
            this.message_box_elm.value = "";
            //focusを戻す
            this.message_box_elm.focus();
        } else if (message.includes("https://live.nicovideo.jp/watch/")) {
            //コメビュモードに入る
            const room_id = message.split("https://live.nicovideo.jp/watch/")[1];
            //websocketを開く
            this.ws_nikonama_comment_reciver = new WebSocket(`ws://${localhost}:${port}/nikonama_comment_reciver/${room_id}/${front_name}`);
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
            this.ws_youtube_comment_reciver = new ExtendedWebSocket(`ws://${localhost}:${port}/YoutubeCommentReceiver/${video_id}/${front_name}`);
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
            console.log(video_id,front_name)
            //Postを送信してRunTwitchCommentReceiverを実行
            await fetch(`http://${localhost}:${port}/RunTwitchCommentReceiver`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ video_id: video_id, front_name: front_name })
            });
            
            await new Promise(resolve => setTimeout(resolve, 3000));

            //websocketを開く
            this.ws_twitch_comment_reciver = new ExtendedWebSocket(`ws://${localhost}:${port}/TwitchCommentReceiver/${video_id}/${front_name}`);
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
            fetch(`http://${localhost}:${port}/StopTwitchCommentReceiver`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ front_name: front_name })
            }).then(response => {
                console.log(response)
            });
        }
        else if (message.includes("背景オン:") || message.includes("GBmode:") || message.includes("MBmode:") || message.includes("BBmode:")) {
            this.human_window.changeBackgroundMode(message);
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
            let message_box = message_box_manager.getMessageBoxByCharName(char_name)
            if (message_box == null) {
                this.sendMessage(comment);
            } else {
                message_box.sendMessage(comment);
            }

        }
    }

    receiveYoutubeLiveComment(event) {
        const message = JSON.parse(event.data);
        const char_name = message["char_name"];
        const comment = message["message"];
        console.log("char_name=",char_name,"comment=",comment)
        if (char_name == this.char_name) {
            this.sendMessage(comment);
        } else {
            let message_box = message_box_manager.getMessageBoxByCharName(char_name)
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
    setGptMode(gpt_mode) {
        this.gpt_mode = gpt_mode;
        this.message_box_manager.setGptMode2AllStatus(this.front_name,gpt_mode);
    }

    sendMessage(message) {
        //メッセージを送信する
        const message_dict = {}
        message_dict[this.front_name] = message;
        const send_data = {
            "message" : message_dict,
            "gpt_mode" : this.message_box_manager.getAllGptModeByDict()
        }
        ws.send(JSON.stringify(send_data));
    }
}

class HumanTab {
    human_tab_elm: HTMLElement;
    human_window_elm: HTMLElement;
    front_name: string;
    // モードとクラス名の対応を定義
    bg_modes: Record<string, { display: string, className: string }> = {
        "背景オン:": { display: "block", className: "" },
        "GBmode:": { display: "none", className: "green_back" },
        "MBmode:": { display: "none", className: "maze_back" },
        "BBmode:": { display: "none", className: "blue_back" },
        // 新しいモードを追加する場合はここに追記
    };

    /**
     * 
     * @param {HTMLElement} human_tab_elm 
     * @param {string} front_name 
     */
    constructor(human_tab_elm,front_name) {
        this.human_tab_elm = human_tab_elm;
        this.human_window_elm = human_tab_elm.getElementsByClassName("human_window")[0];
        this.front_name = front_name;
    }

    /**
     *  @param {"背景オン:"|"GBmode:"|"MBmode:"|"BBmode:"} mode_key
     */
    changeBackgroundMode(mode_key) {
        let ELM_human_tab = this.human_window_elm.closest(".human_tab");
        let ELM_bg_image = ELM_human_tab?.getElementsByClassName("bg_images")[0] as HTMLElement;
        const ELM_human = ELM_human_tab?.getElementsByClassName("human")[0];

        // 全ての可能な背景クラスを削除
        ELM_human?.classList.remove("green_back", "maze_back", "blue_back");

        const mode = this.bg_modes[mode_key];

        if (mode) {
            // ELM_bg_imageの表示状態を更新
            ELM_bg_image.style.display = mode.display;

            // 必要ならクラス名を追加
            if (mode.className) {
                ELM_human?.classList.add(mode.className);
            }
        }
    }

}

function getMessageBoxByCharName(char_name) {
    return message_box_manager.message_box_dict.get(char_name);
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
    ws.send(inputs_json)

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
    
    let body_parts:HumanData = JSON.parse(JSON.parse(event.data));
    console.log(body_parts)
    console.log(body_parts.char_name,body_parts["char_name"])
    
    console.log("human_listに追加:"+body_parts["char_name"])
        
    try{
        humans_list[body_parts["char_name"]] = new HumanBodyManager2(body_parts)
    } catch (e) {
        console.log(e)
        console.log("human_listに追加失敗:"+body_parts["char_name"])
    }

    front2chara_name[body_parts["front_name"]] = body_parts["char_name"]
    console.log("front2chara_name=",front2chara_name)
    
}

export interface WavInfo {
    path: string; // wavファイルのパス
    wav_data: string; // wavファイルのデータ（Base64形式）
    phoneme_time: string; // 音素の開始時間と終了時間の情報
    phoneme_str: string; // 音素の情報
    char_name: string; // キャラの名前
    voice_system_name: string; // 音声合成のシステムの名前
}

//gptで生成された会話データを受信したときのイベント関数
export async function receiveConversationData(event) {
    // console.log(typeof(event.data))
    // alert(event.data)
    var human_tab = document.getElementsByClassName('human_tab');
    let obj = JSON.parse(JSON.parse(event.data));
    console.log("メッセージを受信")
    console.log(obj)
    var audio_group = document.getElementsByClassName("audio_group")[0]
    if ("chara_type" in obj && obj["chara_type"] == "gpt") {
        //文章を表示
        const /**@type {Record<String,string>} */ sentence = obj["sentence"];
        const textPromise = execText(sentence,human_tab)

        //音声を再生
        const /**@type {WavInfo[]} */ wav_info  = obj["wav_info"];
        const audioPromise = execAudioList(wav_info,audio_group)

        // 両方の処理が終わるのを待つ
        await Promise.all([textPromise, audioPromise]);

        //gptからの音声だった場合は終了を通知。
        const front_name = getNthKeyFromObject(sentence, 0)
        const message_box = message_box_manager.getMessageBoxByFrontName(front_name);
        if (message_box) {
            const human_gpt_routine_ws = message_box.gpt_setting_button_manager_model.human_gpt_routine_ws_dict[front_name];
            human_gpt_routine_ws.sendJson({ "gpt_voice_complete": "complete" });
        }
        
    } else if("chara_type" in obj && obj["chara_type"] == "player") {
        //文章を表示
        const /**@type {Record<String,string>} */ sentence = obj["sentence"];
        const textPromise = execText(sentence,human_tab)

        //音声を再生
        const /**@type {WavInfo[]} */ wav_info  = obj["wav_info"];
        const audioPromise = execAudioList(wav_info,audio_group)

        // 両方の処理が終わるのを待つ
        await Promise.all([textPromise, audioPromise]);
    } else {
        if (0 in obj && "wav_data" in obj[0]) {
            //wavファイルが送られてきたときの処理。
            //複数のwavファイルが送られてくるのでaudio_groupに追加していく。
            await execAudioList(obj,audio_group)
        }
        else {
            await execText(obj,human_tab)
        }
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

/**
 * @param {WavInfo[]} obj 
 * @param {Element} audio_group 
 */
async function execAudioList(obj,audio_group) {
    console.log(obj)
        
    for await(let item of obj){
        console.log("audio準備開始")
        audio_group = await execAudio(item,audio_group);
        console.log(item["char_name"]+`音源再生終了`)
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
async function execAudio(obj,audio_group, maxAudioElements = 100) {
    //wavファイルをバイナリー形式で開き、base64エンコードした文字列を取得
    var wav_binary = obj["wav_data"]
    //wavファイルをbase64エンコードした文字列をaudioタグのsrcに設定
    var lab_data = obj["phoneme_str"];
    const voice_system_name = obj["voice_system_name"];
    console.log("lab_data=",lab_data)
    var audio = document.createElement('audio');
    audio.src = `data:audio/wav;base64,${wav_binary}`;
    //audioタグを追加
    audio_group.appendChild(audio);

    // audio_group内のaudioエレメントが上限を超えたら、最初のエレメントを削除
    while (audio_group.childElementCount > maxAudioElements) {
        audio_group.removeChild(audio_group.firstElementChild);
    }

    audio.load();
    await new Promise(resolve => audio.onloadedmetadata = resolve);
    //audioの長さを取得
    const time_length = audio.duration * 1000;
    //labdataの最後の要素の終了時間を取得
    const last_end_time = lab_data[lab_data.length-1][2] * 1000;
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
            var intervalId = setInterval(() => {
                var current_time = audio.currentTime * 1000;
                // console.log("current_time="+current_time, "lab_pos="+lab_pos);
                
                if (lab_data[lab_pos] !== undefined) {
                    var start_time = lab_data[lab_pos][1] * 1000 * ratio;
                    var end_time = lab_data[lab_pos][2] * 1000 * ratio;
                } else {
                    console.error('Invalid lab_pos:', lab_data, "lab_pos="+lab_pos);
                    // ここで適切なエラーハンドリングを行います
                }

                // todo start_timeとend_timeが定義されないまま入ってるときにバグってる可能性がある
                if (start_time <= current_time && current_time <= end_time ) {
                    // console.log("通ってる",obj["char_name"],lab_data[lab_pos][0]);
                    try{
                        humans_list[obj["char_name"]].changeLipImage(obj["char_name"],lab_data[lab_pos][0]);
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
                        humans_list[obj["char_name"]].changeLipImage(obj["char_name"],"end");
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

async function async_receiveConversationData(event){
    await receiveConversationData(event);
}

/**
 * グローバルなイベントキューからイベントを取り出して処理する
 * 処理が終わったら再帰的に自身を呼び出す
 * ただし、処理中は次のイベントを処理しない
 **/
async function processMessages() {
    console.log("メッセージからprocessMessages()を呼び出しました、isProcessing=",isProcessing)
    if (isProcessing || messageQueue.length === 0) {
        // 処理中 or キューが空なら何もしない
        console.log("処理中 or キューが空なので何もしない")
        return;
    }
    // 処理を実行するので処理中フラグを立てる
    isProcessing = true;
    // キューからイベントを取り出して処理する
    var new_event = messageQueue.shift();
    await receiveConversationData(new_event);
    isProcessing = false;
    console.log("次のprocessMessages()を呼び出します")
    processMessages();
}            




function sendHumanName(human_name) {
    if (human_ws.readyState !== WebSocket.OPEN) {
        humanWsOpen();
        human_ws.onopen = function(e) {
            human_ws.send(human_name);
        };
    }
    human_ws.send(human_name);
}

function clearText(button) {
    let text = button.parentNode.parentNode.getElementsByClassName("messageText")[0]
    text.value = ""
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
    
    


    constructor(body_parts: HumanData,human_window:Element|null = null){
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
                this.pose_patterns = this.setPosePatternFromInitImageInfo(init_image_info);
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
            console.log(e.message);
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
                let a = this.pose_patterns.get("init")?.get(key_part_name);
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
            if (!["all_data", "OnomatopeiaActionSetting", "nowOnomatopoeiaActionSetting"].includes(key)) {
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
        oprator_canvas.style.zIndex = String(50000);
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
    getBodyImgElemnt(part_group_name:BodyUnitKey ,part_name:BodyUnitVariationKey): HTMLCanvasElement|undefined{
        const part_info = this.getPartInfoFromPartGroupName(part_group_name);
        const body_img_elemnt_map = part_info?.body_img_elemnt_map
        if (body_img_elemnt_map?.has(part_name) == false){
            //initでoffになっているパーツの場合、まだ作られてないのでnullを返し、これから作る。
            return null;
        }
        const body_img_elemnt = body_img_elemnt_map?.get(part_name);
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
     * @param {string} char_name - キャラの名前
     * @param {string} phoneme - 音素
     */
    changeLipImage(char_name:string ,phoneme:string){
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

    changeEyeImage(open_close: OpenClose){
        console.log("目を動かす。",open_close);
        if (this.eye_images.size > 1) {
            if (this.mouse_images.has(open_close)){
                const next_img_name = this.mouse_images.get(open_close);
                this.radioChangeImage(this.mouse_folder_name, next_img_name, "on")
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

    setLipSyncModeToPakuPaku(onomatopoeia_action_mode: MousePakuType){
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




function drawFillRectInOpratorCanvas(x,y,width,height,color){
    var debug = false;
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
    ws = new WebSocket(`ws://${localhost}:${port}/ws/${client_id}`);

    ws.onmessage = function(event:MessageEvent) {
        messageQueue.push(event);
        console.log("messageQueue=",messageQueue,"messageQueueをpushしました","isProcessing=",isProcessing);
        processMessages();
        console.log("messageQueue=",messageQueue,"イベントを一つとりだした後のmessageQueueです");
    };

    ws.onclose = closeEventProcces_ws;
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

async function getClientId() {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://${localhost}:${port}/id_create`);
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
    var front_name = Object.keys(front2chara_name).find(key => front2chara_name[key] === chara_name);
    if (front_name === undefined){
        //一致するキーがない場合は、"no_front_name"を返す
        return "no_front_name";
    }
    return front_name;
}

function humanWsOpen(){
    human_ws = new WebSocket(`ws://${localhost}:${port}/human/${client_id}`);
    human_ws.onmessage = receiveMessage;
    console.log("human_wsが接続されました。");
}



//ここから下がメイン処理
var message_box_manager = new MessageBoxManager();
const localhost = location.hostname;
const port = "8010"
var init_human_tab = document.getElementsByClassName("tab human_tab")[0] as HTMLLIElement;
addClickEvent2Tab(init_human_tab)
//var ws = new WebSocket("ws://localhost:${port}/InputGPT")
//var ws = new WebSocket("ws://localhost:${port}/InputPokemon");
var messageQueue:MessageEvent[] = [];
var isProcessing = false;

/** @type {Record<string,HumanBodyManager2>} */
var humans_list = {};
/** @type {Record<string,string>} */
var front2chara_name = {};
/** @type {Record<string,VoiroAISetting>} */
var setting_info = {}; //どのキャラの設定がオンになっているかを管理する

let first_human_tab = document.getElementsByClassName("tab human_tab")[0];
/**@type {DragDropFile[]} */
let drag_drop_file_event_list = [new DragDropFile(first_human_tab)];
console.log("ドラッグアンドドロップイベントを追加しました。");


//これらの変数はグローバル変数にする必要がある
let client_id;
var ws;
var human_ws;
var test = 0;

getClientId().then(recieve_client_id => {
    client_id = recieve_client_id;
    ws = new WebSocket(`ws://${localhost}:${port}/ws/${client_id}`);
    ws.onmessage = function(event) {
        messageQueue.push(event);
        console.log("messageQueue=",messageQueue,"messageQueueをpushしました","isProcessing=",isProcessing);
        processMessages();
        console.log("messageQueue=",messageQueue,"イベントを一つとりだした後のmessageQueueです");
    };
    ws.onclose = closeEventProcces_ws;

    humanWsOpen();
    
    
});
