import { ExtendFunction } from "../../Extend/extend";
import { IDragAble, DragMover } from "../Base/DragableComponent";
import { BaseComponent, IHasComponent } from "../Base/ui_component_base";
import "./SquareComponent.css";

/**
 * 四角形のボードのコンポーネント
 */
export class ScrollableSquareBoardComponent implements IHasComponent, IDragAble {
    private _title: string;
    public get title(): string { return this._title; }
    public readonly component: BaseComponent;
    public readonly dragMover: DragMover;
    public readonly id: string;

    /**
     * コンストラクタ
     * @param size - ボードのサイズ（ピクセル単位）
     * @param additionalClassNames - 追加するCSSクラス名の配列
     * @param customStyles - 追加するインラインスタイルのオブジェクト
     */
    constructor(
        title: string,
        width: string|null, height: string|null,
        additionalClassNames: string[] = [],
        customStyles: Partial<CSSStyleDeclaration> = {},
        id: string|null = null,
        enableDrag: boolean = true
    ) {
        this._title = title;
        this.id = id ?? ExtendFunction.uuid();
        // ヘッダーと内容領域を分離する
        const htmlString = `
        <div class="square-board-${this.id}">
            <div class="SquareBoardHeader">
                <div class="boardTitle">${title}</div>
            </div>
            <div class="SquareBoardContent">
            </div>
        </div>`;
        this.component = BaseComponent.createElementByString(htmlString);
        this.component.addCSSClass(["margin"]);
        this.setStyle(); // サイズやスタイルを設定
        this.changeSize(width, height);
        this.addAdditionalClasses(additionalClassNames);
        this.applyCustomStyles(customStyles);
        this.dragMover = new DragMover(this);
        this.dragMover.setEnableDrag(enableDrag);
    }

    public setTitle(title: string): void {
        this.component.element.querySelector(".boardTitle")!.innerHTML = title;
    }

    /**
     * ボードのスタイルを設定する
     */
    public setStyle(): void {
        // ユニークなクラス名を利用してスタイルを適用
        const baseStyle = `
            .square-board-${this.id} {
                background-color: #f0f0f0;
                border: 2px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
                overflow: hidden; /* 全体ははみ出さない */
            }
            /* ヘッダーは固定高さ */
            .square-board-${this.id} .SquareBoardHeader {
                background: #ddd;
            }
            /* 内容領域は残りの高さでスクロール可能にする */
            .square-board-${this.id} .SquareBoardContent {
                height: calc(100% - 50px);
                overflow-y: auto;
                overflow-x: hidden; /* 横スクロールを禁止 */
            }
        `;
        this.addDynamicStyles(baseStyle);
    }

    public changeSize(width: string|null, height: string|null): void {
        if (width !== null) {
            this.component.element.style.width = width;
        }

        if (height !== null) {
            this.component.element.style.height = height;
        }
    }

    /**
     * 初期位置を設定する
     * @param left - 初期の left 値
     * @param top - 初期の top 値
     */
    public setInitialPosition(left: number, top: number): void {
        this.component.element.style.left = `${left}px`;
        this.component.element.style.top = `${top}px`;
    }

    /**
     * 外部から追加のCSSクラス名を適用する
     * @param classNames - 追加するクラス名の配列
     */
    public addAdditionalClasses(classNames: string[]): void {
        this.component.addCSSClass(classNames);
    }

    /**
     * 外部からインラインスタイルを適用する
     * @param styles - 適用するスタイルのオブジェクト
     */
    public applyCustomStyles(styles: Partial<CSSStyleDeclaration>): void {
        Object.assign(this.component.element.style, styles);
    }

    /**
     * 動的にCSSスタイルを追加する
     * @param style - 追加するCSSスタイルの文字列
     */
    private addDynamicStyles(style: string): void {
        const styleElement = document.createElement('style');
        styleElement.appendChild(document.createTextNode(style));
        document.head.appendChild(styleElement);
    }

    getTitleHeight(): number {
        const title = this.component.element.getElementsByClassName("boardTitle")[0];
        const h = title.getBoundingClientRect().height;
        return h;
    }

    getTitleWidth(): number {
        const title = this.component.element.getElementsByClassName("boardTitle")[0];
        const w = title.getBoundingClientRect().width;
        return w;
    }

    public addComponentToHeader(component: IHasComponent): void {
        this.component.createArrowBetweenComponents(this, component, "SquareBoardHeader");
    }

    public addComponentToContent(component: IHasComponent): void {
        this.component.createArrowBetweenComponents(this, component, "SquareBoardContent");
    }

    public delete(): void {
        this.component.delete();
    }

    public moveComponent(fromIndex: number, toIndex: number): void {
        const parentElement = this.component.element;
        const children = parentElement.children;
    
        if (fromIndex >= 0 && fromIndex < children.length && toIndex >= 0 && toIndex < children.length) {
            const elementToMove = children[fromIndex];
            const referenceElement = children[toIndex];
    
            // fromIndex の要素を toIndex の前に挿入
            parentElement.insertBefore(elementToMove, referenceElement);
        } else if (toIndex === children.length) {
            // toIndex が children.length の場合は末尾に追加
            const elementToMove = children[fromIndex];
            parentElement.appendChild(elementToMove);
        } else {
            console.error('Invalid indices for moveComponent:', fromIndex, toIndex);
        }
    }


}