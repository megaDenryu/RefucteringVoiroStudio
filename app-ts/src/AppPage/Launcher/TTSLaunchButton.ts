import { BaseComponent, IHasComponent } from "../../UiComponent/Base/ui_component_base";
import { NormalButton } from "../../UiComponent/Button/NormalButton/NormalButton";
import { SentenceDisplay } from "../../UiComponent/Display/SentenceDisplay/SentenceDisplay";
import { TTSSoftware } from "../../ValueObject/Character";
import { RequestAPI } from "../../Web/RequestApi";


export type TTSLaunchReq = {

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
        this._launchButton = new NormalButton(this.tts,"normal").addOnClickEvent(this.launch.bind(this));
        this.component = this._launchButton.component;
        
        return this;
    }

    public launch(): void {
        if (this._notifyBoard == null) {
            this._notifyBoard = new SentenceDisplay("お知らせ", this.tts + "を起動中...").open();
            this._parent.component.createArrowBetweenComponents(this._parent,this._notifyBoard);
        }
        else {
            this._notifyBoard.open();
        }
        // RequestAPI.postRequest("LaunchTTSSoftware", {tts: this.tts});
        
    }
    
    public addOnClickEvent(f: (() => void)): TTSLaunchButton {
        this._launchButton.addOnClickEvent(f);
        return this;
    }

    public delete(): void {
        this.component.delete();
    }


}