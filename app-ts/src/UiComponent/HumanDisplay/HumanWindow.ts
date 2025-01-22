

import { createHumanBox, DragDropFile, GlobalState, HumanBodyManager2, sendHumanName, VoiceRecognitioManager, VoiroAISetting } from "../../AppPage/AppVoiroStudio/AppVoiroStudio";
import { ReactiveProperty } from "../../BaseClasses/EventDrivenCode/observer";
import { ExtendFunction } from "../../Extend/extend";
import { CharacterId, CharacterModeState, NickName } from "../../ValueObject/Character";
import { CharaCreateData, HumanData } from "../../ValueObject/IHumanPart";
import { DragMover } from "../Base/DragableComponent";
import { BaseComponent, IHasComponent } from "../Base/ui_component_base";
import { CharaSelectFunctionCreater } from "../CharaInfoSelecter/CharaSelectFunctionCreater";
import { IAddHumanButton, IBackGroundImage, IBackGroundImages, IBodySettingButton, IDeleteHumanButton, IHumanName, IHumanSelectPanelStartButton, IHumanTab, IHumanWindow, IMicToggleButton } from "./IHumanWindow";

export class HumanTab implements IHasComponent,IHumanTab {

    component: BaseComponent;
    humanWindow: HumanWindow;
    humanName: HumanName;
    deleteHumanButton: DeleteHumanButton;
    humanSelectPanelStartButton: HumanSelectPanelStartButton;
    bodySettingButton: BodySettingButton;
    micToggleButton: MicToggleButton;
    addHumanButton: AddHumanButton;
    backGroundImages: BackGroundImages;

    characterId: CharacterId;

    characterModeState: CharacterModeState|null = null;
    character
    // モードとクラス名の対応を定義
    bg_modes: Record<string, { display: string, className: string }> = {
        "背景オン:": { display: "block", className: "" },
        "GBmode:": { display: "block", className: "green_back" },
        "MBmode:": { display: "block", className: "maze_back" },
        "BBmode:": { display: "block", className: "blue_back" },
        // 新しいモードを追加する場合はここに追記
    };

    delete(): void {
        this.component.delete();
    }

    get human_tab_elm(): HTMLElement {
        return this.component.element;
    }
    get message_col_elm(): HTMLElement {
        return this.human_tab_elm.getElementsByClassName("message_col")[0] as HTMLElement;
    }

    get human_window_elm(): HTMLElement {
        return this.human_window_elm;
    }


    /**
     * 
     * @param {HTMLElement} human_tab_elm 
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
        this.backGroundImages = new BackGroundImages(human_tab_elm.getFirstHTMLElementByClassName("bg_images"));
        this.characterId = ExtendFunction.uuid() as CharacterId;
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
        const ELM_human = this.component.element.getElementsByClassName("human")[0] as HTMLElement;
        const ELM_bg_image = this.component.element.getElementsByClassName("bg_images")[0] as HTMLElement;

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

    //キャラを選択してフロントネームが確定したときにキャラ名表示の場所にフロントネームを表示し、messageBoxやhumanTabにキャラクターIDを登録する
    registerHumanInfo(nick_name:NickName) {
        this.humanWindow.addClass(this.characterId);
        this.humanName.setName(nick_name);
        //今のhuman_tabの番号を取得
        const tab_num = this.component.element.getAttribute('data-tab_num');
        if (tab_num === null) {return;}
        GlobalState.message_box_manager.linkCharaIdAndNum(this.characterId,Number(tab_num))
    }

    deleteHumanTab() {
        this.component.element.remove();
        //ニコ生コメント受信を停止する。nikonama_comment_reciver_stopにcharacterIdをfetchで送信する。
        fetch(`http://${GlobalState.localhost}:${GlobalState.port}/nikonama_comment_reciver_stop/${this.characterId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ characterId: this.characterId })
        })
        //設定タブを開いてるならエレメントを削除し、setting_infoからも削除
        if (this.characterId in GlobalState.setting_info) {
            GlobalState.setting_info[this.characterId].ELM_accordion.remove();
            delete GlobalState.setting_info[this.characterId];
            
        }
        
        //このタブのキャラのデータを削除
        if (this.characterId in GlobalState.humans_list) {
            delete GlobalState.humans_list[this.characterId];
        }
        
        //message_box_managerからも削除
        GlobalState.message_box_manager.deleteMessageBoxByCharId(this.characterId);
    }

    charaSelectPanelStart() {
        let element = document.body;
        CharaSelectFunctionCreater.init(element, this);
    }

    createHuman(charaCreateData:CharaCreateData){
        const humanData:HumanData = charaCreateData.humanData;
        GlobalState.humans_list[charaCreateData.characterModeState.id] = new HumanBodyManager2(humanData, charaCreateData.characterModeState, this.humanWindow.component.element);
        const characterModeState:CharacterModeState = CharacterModeState.fromDict(charaCreateData.characterModeState);
        this.characterModeState = characterModeState;

    }

}

export class HumanWindow implements IHasComponent, IHumanWindow {
    component: BaseComponent;
    constructor(element: HTMLElement) {
        this.component = new BaseComponent(element);
    }

    public addClass(className: string) {
        this.component.element.classList.add(className);
    }

    delete(): void {
        this.component.delete();
    }
}

export class DeleteHumanButton implements IHasComponent, IDeleteHumanButton {
    component: BaseComponent;
    onClick:ReactiveProperty<boolean> = new ReactiveProperty(false);
    constructor(element: HTMLElement) {
        this.component = new BaseComponent(element);
        this.component.element.addEventListener("click", () => {this.onClick.set(true)});
    }
    addOnclick(func:()=>void) {
        this.onClick.addMethod(func);
    }

    delete(): void {
        this.component.delete();
    }
}

export class HumanName implements IHasComponent, IHumanName {
    component: BaseComponent;
    nick_name: NickName|null = null;
    onClick:ReactiveProperty<boolean> = new ReactiveProperty(false);
    humanTab: HumanTab;
    constructor(element: HTMLElement, humanTab: HumanTab) {
        this.component = new BaseComponent(element);
        this.component.element.addEventListener("click", () => {this.onClick.set(true)});
        this.humanTab = humanTab;
        this.onClick.addMethod(() => {this.inputHumanaName()});
    }
    setName(nick_name:NickName) {
        this.nick_name = nick_name;
        this.component.element.innerText = nick_name.name;
        this.component.removeCSSClass("input_now");
    }
    addClass(className: string) {
        this.component.addCSSClass(className);
    }
    removeClass(className: string) {
        this.component.removeCSSClass(className);
    }

    delete(): void {
        this.component.delete();
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
                const nick_name = new NickName(input.value);
                this.humanTab.registerHumanInfo(nick_name);
                sendHumanName(nick_name)
                input.remove();
            }
        });
        //フォーカスが外れたときにinputを削除
        input.addEventListener("blur", handleBlur);
        this.component.element.appendChild(input);
        input.focus();
    }
}

export class HumanSelectPanelStartButton implements IHasComponent, IHumanSelectPanelStartButton {
    component: BaseComponent;
    _onClick:ReactiveProperty<boolean> = new ReactiveProperty(false);
    constructor(element: HTMLElement) {
        this.component = new BaseComponent(element);
        this.component.element.addEventListener("click", () => {this._onClick.set(true)});
    }
    addOnClick(func:()=>void) {
        this._onClick.addMethod(func);
    }

    delete(): void {
        this.component.delete();
    }
}

export class BodySettingButton implements IHasComponent, IBodySettingButton {
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
        const characterId = this.humanTab.characterId;
        if (characterId in GlobalState.setting_info) {
            if (GlobalState.setting_info[characterId].ELM_accordion.classList.contains("vissible")){
                GlobalState.setting_info[characterId].ELM_accordion.classList.remove("vissible")
                GlobalState.setting_info[characterId].ELM_accordion.classList.add("non_vissible")
            }else{
                GlobalState.setting_info[characterId].ELM_accordion.classList.remove("non_vissible")
                GlobalState.setting_info[characterId].ELM_accordion.classList.add("vissible")
            }
        } else {
            if (!(characterId in GlobalState.humans_list)) {return;}
            const chara_human_body_manager = GlobalState.humans_list[characterId]
            var vas = new VoiroAISetting(chara_human_body_manager, this.humanTab);
            GlobalState.humans_list[characterId].BindVoiroAISetting(vas);
            GlobalState.setting_info[characterId] = vas;
            GlobalState.setting_info[characterId].ELM_accordion.classList.add("vissible")
        }
    }

    delete(): void {
        this.component.delete();
    }

}

export class MicToggleButton implements IHasComponent, IMicToggleButton {
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

    delete(): void {
        this.component.delete();
    }
}

export class AddHumanButton implements IHasComponent, IAddHumanButton {
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
        let messageBox = createHumanBox(clone);
        GlobalState.drag_drop_file_event_list?.push(new DragDropFile(messageBox.human_tab));
    }

    delete(): void {
        this.component.delete();
    }


}

export class BackGroundImage implements IHasComponent, IBackGroundImage {
    private readonly Def = `<img class="bg_image" src="" alt="">`;
    component: BaseComponent;
    dragMover: DragMover;
    constructor(readerResult: string) {
        this.component = BaseComponent.createElementByString(this.Def);
        this.setBackGroundImage(readerResult);
        this.dragMover = new DragMover(this);
    }

    setBackGroundImage(readerResult: string) {
        (this.component.element as HTMLImageElement).src = readerResult;
    }

    delete(): void {
        this.component.delete();
    }
}

export class BackGroundImages implements IHasComponent, IBackGroundImages {
    component: BaseComponent;
    backGroundImages: BackGroundImage[] = [];
    constructor(element: HTMLElement) {
        this.component = new BaseComponent(element);
    }

    addBackGroundImage(readerResult: string) {
        let bg_image = new BackGroundImage(readerResult);
        this.component.createArrowBetweenComponents(this, bg_image);
        this.backGroundImages.push(bg_image);
    }

    delete(): void {
        this.component.delete();
    }
}