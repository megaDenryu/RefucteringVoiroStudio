import { IHasComponent, BaseComponent } from "../../Base/ui_component_base";
import { IHasSquareBoard } from "../../Board/IHasSquareBoard";
import { SquareBoardComponent } from "../../Board/SquareComponent";
import { NormalButton } from "../../Button/NormalButton/NormalButton";
import { closeButton } from "../../Button/NormalButton/style.css";
import { NormalText } from "../Text/NormalText";

export interface ISentenceDisplayInput {
    title: string;
    sentence: string;
    width: string|null;
    height: string|null;
}
export class SentenceDisplay implements IHasComponent,IHasSquareBoard {
    public readonly title: string;
    public component: BaseComponent;
    public squareBoardComponent: SquareBoardComponent;
    private closeButton: NormalButton;
    private _sentence: string;
    private _sentenceDisplay: NormalText;

    public constructor(input: ISentenceDisplayInput) {
        this.title = input.title;
        this._sentence = input.sentence;
        this.squareBoardComponent = new SquareBoardComponent(
            this.title,
            input.width,input.height,
            [],
            {},
            null,
            false
        );
        this.component = this.squareBoardComponent.component;
        this.closeButton = new NormalButton("閉じる",closeButton).addOnClickEvent(() => {this.close()});
        this._sentenceDisplay = new NormalText(input.sentence);
        this.component.createArrowBetweenComponents(this,this._sentenceDisplay);
        this.squareBoardComponent.addComponentToHeader(this.closeButton);
        this.initialize();
        return this;
    }

    private initialize() {
        // cssを適用
        // this.squareBoardComponent.component.element.classList.add("SetenceDiplayWindow");
        // this._sentenceDisplay.component.element.classList.add("SentenceText");
    }

    public onAddedToDom(): void {
    }

    public optimizeBoardSize(): void {
        
    }

    public delete(): void {
        this.component.delete();
    }

    public isOpenned(): boolean {
        return this.component.isShow
    }

    public open(): SentenceDisplay {
        this.component.show();
        return this;
    }

    public close(): SentenceDisplay {
        this.component.hide();
        return this;
    }

    public changeSentence(sentence: string): SentenceDisplay {
        this._sentence = sentence;
        this._sentenceDisplay.changeText(sentence);
        return this;
    }

    public transform(): SentenceDisplay {
        // 場所を中央にする。style="transform: translate(76px, -557px);"に設定
        this.component.element.style.transform = "translate(76px, -557px)";
        return this;
    }  
}