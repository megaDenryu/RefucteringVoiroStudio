import { BaseComponent, IHasComponent } from "../../UiComponent/Base/ui_component_base";
import { IHasSquareBoard } from "../../UiComponent/Board/IHasSquareBoard";
import { SquareBoardComponent } from "../../UiComponent/Board/SquareComponent";
import { SentenceDisplay } from "../../UiComponent/Display/SentenceDisplay/SentenceDisplay";
import { TTSSoftware } from "../../ValueObject/Character";
import { TTSLaunchButton } from "./TTSLaunchButton";


export class Launcher implements IHasSquareBoard, IHasComponent {
    public readonly title: string = "Launcher";
    public component: BaseComponent;
    public squareBoardComponent: SquareBoardComponent;
    private _aivoiceLaunchButton: TTSLaunchButton;
    private _voiceVoxLaunchButton: TTSLaunchButton;
    private _coeiroinkLaunchButton: TTSLaunchButton;
    private _cevioAIVoiceLaunchButton: TTSLaunchButton;

    constructor() {
        this.squareBoardComponent = new SquareBoardComponent(
            this.title,
            null,null,
            [],
            {},
            null,
            false
        );
        this.component = this.squareBoardComponent.component.setAsParentComponent();
        this._aivoiceLaunchButton = new TTSLaunchButton("AIVoice",this).setAsChildComponent();
        this._voiceVoxLaunchButton = new TTSLaunchButton("VoiceVox",this).setAsChildComponent();
        this._coeiroinkLaunchButton = new TTSLaunchButton("Coeiroink",this).setAsChildComponent();
        this._cevioAIVoiceLaunchButton = new TTSLaunchButton("CevioAI",this).setAsChildComponent();
        this.initialize();
        return this;
    }

    public onAddedToDom(): void {
    }

    public optimizeBoardSize(): void {
        
    }

    private initialize() {
        // this.component.setAsParentComponent();
        this.component.createArrowBetweenComponents(this,this._aivoiceLaunchButton);
        this.component.createArrowBetweenComponents(this,this._voiceVoxLaunchButton);
        this.component.createArrowBetweenComponents(this,this._coeiroinkLaunchButton);
        this.component.createArrowBetweenComponents(this,this._cevioAIVoiceLaunchButton);
    }

    public delete(): void {
        this.component.delete();
    }

    public setAsChildComponent(): Launcher {
        this.component.setAsChildComponent();
        return this;
    }

}