import { BaseComponent, IHasComponent } from "../../UiComponent/Base/ui_component_base";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { SentenceDisplay } from "../../UiComponent/Display/SentenceDisplay/SentenceDisplay";
import { TTSSoftware } from "../../ValueObject/Character";
import { RequestAPI } from "../../Web/RequestApi";
import * as styles from './styles.css';


export type LaunchTTSSoftwareReq = {
    tts: TTSSoftware;
}

export type LaunchTTSSoftwareRes = {
    message: string;
}

export function getTTSStyle(tts:TTSSoftware): string {
    switch(tts) {
        case "AIVoice":
            return styles.aiVoiceButton;
        case "VoiceVox":
            return styles.voiceVoxButton;
        case "Coeiroink":
            return styles.coeiroinkButton;
        case "CevioAI":
            return styles.cevioAIButton;
    }
}

export class TTSLaunchButton implements IHasComponent {
    public readonly title: string = "TTSLaunchButton";
    public readonly tts: TTSSoftware;
    public component: BaseComponent;
    private _launchButton: NormalButton;
    private _notifyBoard: SentenceDisplay;
    private _parent: IHasComponent;

    public constructor(tts: TTSSoftware, parent: IHasComponent) {
        this.tts = tts;
        this._parent = parent;
        this._launchButton = new NormalButton(this.tts,getTTSStyle(tts)).addOnClickEvent(this.launch.bind(this));
        this.component = this._launchButton.component;
        return this;
    }

    public launch(): void {
        if (this._notifyBoard == null) {
            this._notifyBoard = new SentenceDisplay({title:"お知らせ", sentence:this.tts + "を起動中...", width:"300px", height:""}).open();
            this._parent.component.createArrowBetweenComponents(this._parent,this._notifyBoard);
        }
        else {
            this._notifyBoard.open();
        }
        let result = RequestAPI.postRequest<LaunchTTSSoftwareRes>("LaunchTTSSoftware", {tts: this.tts});
        result.then((res) => {
            this._notifyBoard.changeSentence(res.message);
        });
    }
    
    public addOnClickEvent(f: (() => void)): TTSLaunchButton {
        this._launchButton.addOnClickEvent(f);
        return this;
    }

    public delete(): void {
        this.component.delete();
    }

    public setAsChildComponent(): TTSLaunchButton {
        this.component.setAsChildComponent();
        return this;
    }
}