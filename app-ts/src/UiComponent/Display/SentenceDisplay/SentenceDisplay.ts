import { IHasComponent, BaseComponent } from "../../Base/ui_component_base";
import { IHasSquareBoard } from "../../Board/IHasSquareBoard";
import { SquareBoardComponent } from "../../Board/SquareComponent";
import { NormalButton } from "../../Button/NormalButton/NormalButton";
import { NormalText } from "../Text/NormalText";

export class SentenceDisplay implements IHasComponent,IHasSquareBoard {
    public readonly title: string;
    public component: BaseComponent;
    public squareBoardComponent: SquareBoardComponent;
    private closeButton: NormalButton;
    private _sentence: string;
    private _sentenceDisplay: NormalText;

    public constructor(title: string, sentence: string) {
        this.title = title;
        this._sentence = sentence;
        this.squareBoardComponent = new SquareBoardComponent(
            this.title,
            null,
            null,
            [],
            {},
            null,
            true
        );
        this.component = this.squareBoardComponent.component;
        this.closeButton = new NormalButton("閉じる","normal").addOnClickEvent(() => {this.close()});
        this._sentenceDisplay = new NormalText(sentence);
        this.component.createArrowBetweenComponents(this,this._sentenceDisplay);
        this.squareBoardComponent.addComponentToHeader(this.closeButton);
        this.initialize();
        return this;
    }

    private initialize() {
        // this.component.setAsParentComponent()
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



    
}