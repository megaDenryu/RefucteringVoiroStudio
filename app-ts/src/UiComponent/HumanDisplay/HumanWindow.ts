

import { addClickEvent2Tab, DragDropFile, GlobalState, HumanBodyManager2, sendHumanName, VoiceRecognitioManager, VoiroAISetting } from "../../AppPage/AppVoiroStudio/AppVoiroStudio";
import { ReactiveProperty } from "../../BaseClasses/observer";
import { ExtendFunction } from "../../Extend/extend";
import { CharacterId, SelectCharacterState } from "../../ValueObject/Character";
import { HumanData } from "../../ValueObject/IHumanPart";
import { BaseComponent, IHasComponent } from "../Base/ui_component_base";
import { CharaSelectFunctionCreater } from "../CharaInfoSelecter/CharaSelectFunctionCreater";

export class HumanTab implements IHasComponent {

    component: BaseComponent;
    humanWindow: HumanWindow;
    humanName: HumanName;
    deleteHumanButton: DeleteHumanButton;
    humanSelectPanelStartButton: HumanSelectPanelStartButton;
    bodySettingButton: BodySettingButton;
    micToggleButton: MicToggleButton;
    addHumanButton: AddHumanButton;

    characterId: CharacterId;

    selectCharacterState: SelectCharacterState|null = null;
    character
    // モードとクラス名の対応を定義
    bg_modes: Record<string, { display: string, className: string }> = {
        "背景オン:": { display: "block", className: "" },
        "GBmode:": { display: "none", className: "green_back" },
        "MBmode:": { display: "none", className: "maze_back" },
        "BBmode:": { display: "none", className: "blue_back" },
        // 新しいモードを追加する場合はここに追記
    };

    get human_tab_elm(): HTMLElement {
        return this.component.element;
    }

    get human_window_elm(): HTMLElement {
        return this.human_window_elm;
    }

    get front_name(): string|null {
        return this.humanName.front_name;
    }

    /**
     * 
     * @param {HTMLElement} human_tab_elm 
     * @param {string} front_name 
     */
    constructor(human_tab_elm:HTMLElement) {
        this.component = new BaseComponent(human_tab_elm);
        this.humanWindow = new HumanWindow(human_tab_elm.getFirstHTMLElementByClassName("human_window"));
        this.deleteHumanButton = new DeleteHumanButton(human_tab_elm.getFirstHTMLElementByClassName("delete_human_button"));
        this.humanName = new HumanName(human_tab_elm.getFirstHTMLElementByClassName("human_name"),this);
        this.humanSelectPanelStartButton = new HumanSelectPanelStartButton(human_tab_elm.getFirstHTMLElementByClassName("human_select_panel"));
        this.bodySettingButton = new BodySettingButton(human_tab_elm.getFirstHTMLElementByClassName("body_setting_button"),this);
        this.micToggleButton = new MicToggleButton(human_tab_elm.getFirstHTMLElementByClassName("mic_toggle_button"));
        this.addHumanButton = new AddHumanButton(human_tab_elm.getFirstHTMLElementByClassName("add_human_button"));
        this.characterId = ExtendFunction.uuid();
        this.Initialize();
    }

    private Initialize():void {
        this.deleteHumanButton.addOnclick(() => {this.deleteHumanTab()});
        this.humanSelectPanelStartButton.addOnClick(() => {this.charaSelectPanelStart()});
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

    registerHumanName(front_name: string) {
        this.humanWindow.addClass(front_name);
        this.humanName.setName(front_name);
        // registerHumanName(front_name, this.component.element, this.characterId);
        //messageBoxにhuman_nameを格納
        //今のhuman_tabの番号を取得
        const tab_num = this.component.element.getAttribute('data-tab_num');
        GlobalState.message_box_manager.linkHumanNameAndNum(front_name,tab_num)
    }

    deleteHumanTab() {
        this.component.element.remove();
        //ニコ生コメント受信を停止する。nikonama_comment_reciver_stopにfront_nameをfetchで送信する。
        const front_name = this.front_name;
        if (!front_name) {return;}
        fetch(`http://${GlobalState.localhost}:${GlobalState.port}/nikonama_comment_reciver_stop/${front_name}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ front_name: front_name })
        })
        const char_name = GlobalState.front2chara_name[front_name]
        //設定タブを開いてるならエレメントを削除し、setting_infoからも削除
        console.log("設定タブを開いてるならエレメントを削除し、setting_infoからも削除")
        if (char_name in GlobalState.setting_info) {
            console.log(char_name+"setteng_infoにあるので削除")
            GlobalState.setting_info[char_name].ELM_accordion.remove();
            delete GlobalState.setting_info[char_name];
            
        }
        
        //このタブのキャラのデータを削除
        if (char_name in GlobalState.humans_list) {
            console.log(char_name+"humans_listにあるので削除")
            delete GlobalState.humans_list[char_name];
        }
        
        //message_box_managerからも削除
        GlobalState.message_box_manager.message_box_dict.delete(front_name);
    }

    charaSelectPanelStart() {
        let element = document.body;
        CharaSelectFunctionCreater.init(element, this);
    }

    createHuman(humanData: HumanData){
        GlobalState.humans_list[humanData["char_name"]] = new HumanBodyManager2(humanData,this.humanWindow.component.element);
        GlobalState.front2chara_name[humanData["front_name"]] = humanData["char_name"]
    }

}

export class HumanWindow implements IHasComponent {
    component: BaseComponent;
    constructor(element: HTMLElement) {
        this.component = new BaseComponent(element);
    }

    public addClass(className: string) {
        this.component.element.classList.add(className);
    }
}

export class DeleteHumanButton implements IHasComponent {
    component: BaseComponent;
    onClick:ReactiveProperty<boolean> = new ReactiveProperty(false);
    constructor(element: HTMLElement) {
        this.component = new BaseComponent(element);
        this.component.element.addEventListener("click", () => {this.onClick.set(true)});
    }
    addOnclick(func:()=>void) {
        this.onClick.addMethod(func);
    }
}

export class HumanName implements IHasComponent {
    component: BaseComponent;
    front_name: string|null = null;
    onClick:ReactiveProperty<boolean> = new ReactiveProperty(false);
    humanTab: HumanTab;
    constructor(element: HTMLElement, humanTab: HumanTab) {
        this.component = new BaseComponent(element);
        this.component.element.addEventListener("click", () => {this.onClick.set(true)});
        this.humanTab = humanTab;
        this.onClick.addMethod(() => {this.inputHumanaName()});
    }
    setName(name: string) {
        this.front_name = name;
        this.component.element.innerText = name;
        this.component.removeCSSClass("input_now");
    }
    addClass(className: string) {
        this.component.addCSSClass(className);
    }
    removeClass(className: string) {
        this.component.removeCSSClass(className);
    }
    inputHumanaName() {
        this.addClass("input_now");
        let input = document.createElement("input")
        input.type = "text"
        input.enterKeyHint = "enter"
        let handleBlur = (event: Event) => {
            this.removeClass("input_now");
            (event.target as HTMLInputElement).remove();
        };
        //pc版
        input.addEventListener("keydown", (event) =>
        {
            if (event.key === "Enter") {
                //removeInputCharaNameイベントを解除する
                input.removeEventListener("blur", handleBlur);
                const human_name = input.value;
                this.humanTab.registerHumanName(human_name);
                sendHumanName(human_name)
                input.remove();
            }
        });
        //フォーカスが外れたときにinputを削除
        input.addEventListener("blur", handleBlur);
        this.component.element.appendChild(input);
        input.focus();
    }
}

export class HumanSelectPanelStartButton implements IHasComponent {
    component: BaseComponent;
    _onClick:ReactiveProperty<boolean> = new ReactiveProperty(false);
    constructor(element: HTMLElement) {
        this.component = new BaseComponent(element);
        this.component.element.addEventListener("click", () => {this._onClick.set(true)});
    }
    addOnClick(func:()=>void) {
        this._onClick.addMethod(func);
    }
}

export class BodySettingButton implements IHasComponent {
    component: BaseComponent;
    toggle: boolean = false;
    humanTab: HumanTab;
    constructor(element: HTMLElement, humanTab: HumanTab) {
        this.component = new BaseComponent(element);
        this.humanTab = humanTab
        this.component.element.addEventListener("click", () => {this.pushSettingButton()});
    }

    pushSettingButton() {
        console.log("pushSettingButton")
        this.component.addCSSClass("setting_now");
        if (this.humanTab.front_name === null) {return;}
        const char_name = GlobalState.front2chara_name[this.humanTab.front_name]; //humanTabを生成したときにfront_nameを付けてないのでエラーになる
        if (char_name in GlobalState.setting_info) {
            console.log(char_name+"setteng_infoにある")
            if (GlobalState.setting_info[char_name].ELM_accordion.classList.contains("vissible")){
                console.log("vissibleを削除",GlobalState.setting_info[char_name].ELM_accordion)
                GlobalState.setting_info[char_name].ELM_accordion.classList.remove("vissible")
                GlobalState.setting_info[char_name].ELM_accordion.classList.add("non_vissible")
            }else{
                console.log("vissibleを追加",GlobalState.setting_info[char_name].ELM_accordion)
                GlobalState.setting_info[char_name].ELM_accordion.classList.remove("non_vissible")
                GlobalState.setting_info[char_name].ELM_accordion.classList.add("vissible")
            }
        } else {
            console.log(char_name+"setteng_infoにない")
            console.log(GlobalState.humans_list)
            if (!(char_name in GlobalState.humans_list)) {return;}
            const chara_human_body_manager = GlobalState.humans_list[char_name]
            var vas = new VoiroAISetting(chara_human_body_manager);
            GlobalState.humans_list[char_name].BindVoiroAISetting(vas);
            GlobalState.setting_info[char_name] = vas;
            GlobalState.setting_info[char_name].ELM_accordion.classList.add("vissible")
        }
    }

}

export class MicToggleButton implements IHasComponent {
    component: BaseComponent;
    
    mode: "npc"|"user" = "npc";
    constructor(element: HTMLElement) {
        this.component = new BaseComponent(element);
        this.component.element.addEventListener("click", () => {
            this.changeMode();
            this.changeOtherButtonModeToNpc();
        });
    }
    changeMode() {
        if (this.mode === "npc") {
            this.mode = "user";
            this.component.element.innerText = "user";
            this.component.removeCSSClass("npc");
            this.component.addCSSClass("user");
            let vrm = VoiceRecognitioManager.singlton()
            vrm.user_number = 1;
            vrm.start();
        } else {
            this.mode = "npc";
            this.component.element.innerText = "npc";
            this.component.removeCSSClass("user");
            this.component.addCSSClass("npc");
            let vrm = VoiceRecognitioManager.singlton()
            vrm.user_number = 0;
            vrm.deleteEventOnEnd();
        }
    }

    changeOtherButtonModeToNpc() {
        let humanTabs: HumanTab[] = GlobalState.message_box_manager.humanTabList;
        for (let humanTab of humanTabs) {
            if (humanTab.micToggleButton !== this) {
                if (humanTab.micToggleButton.mode === "user") {
                    humanTab.micToggleButton.changeMode();
                }
            }
        }
    }
}

export class AddHumanButton implements IHasComponent {
    component: BaseComponent;
    constructor(element: HTMLElement) {
        this.component = new BaseComponent(element);
        this.component.element.addEventListener("click", () => {this.addHumanTab()});
    }

    addHumanTab() {
        const humans_space: HTMLElement = document.getElementsByClassName('humans_space')[0] as HTMLElement;
        // 追加タブを追加
        const tab: HTMLElement = humans_space.querySelector(".init_tab") as HTMLElement;
        const clone: HTMLElement = tab.cloneNode(true) as HTMLElement;
        clone.classList.remove("init_tab");
        clone.classList.add("tab");
        (clone.getElementsByClassName('human_name')[0] as HTMLElement).innerText = "????";
        humans_space.append(clone);
        let messageBox = addClickEvent2Tab(clone);
        GlobalState.drag_drop_file_event_list?.push(new DragDropFile(messageBox.human_tab));
    }


}