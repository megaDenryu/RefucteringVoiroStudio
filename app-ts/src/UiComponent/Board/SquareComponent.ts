import { ExtendFunction } from "../../Extend/extend";
import { IDragAble, DragMover } from "../Base/DragableComponent";
import { BaseComponent, IHasComponent } from "../Base/ui_component_base";

/**
 * 四角形のボードのコンポーネント
 */
export class SquareBoardComponent implements IHasComponent, IDragAble {
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
        width: number, height: number,
        additionalClassNames: string[] = [],
        customStyles: Partial<CSSStyleDeclaration> = {},
        id: string|null = null
    ) {
        this.id = id ?? ExtendFunction.uuid();
        const htmlString = `
        <div class="square-board-${this.id}">
            <div class="boardTitle"> ${title} </div>
        </div>`;
        this.component = BaseComponent.createElementByString(htmlString);
        this.setSize(width, height); // サイズを設定
        // this.setInitialPosition(0, 0); // 初期位置を設定
        this.addAdditionalClasses(additionalClassNames); // 追加クラスを適用
        this.applyCustomStyles(customStyles); // 追加スタイルを適用
        this.dragMover = new DragMover(this);
    }

    /**
     * ボードのサイズを設定する
     * @param size - ボードのサイズ（ピクセル単位）
     */
    public setSize(width: number, height: number): void {
        const baseStyle = `
            .square-board-${this.id} {
                position: relative;
                width: ${width}px;
                height: ${height}px;
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                box-sizing: border-box;
            }
        `;
        this.addDynamicStyles(baseStyle);
    }

    public changeSize(width: number, height: number): void {
        this.component.element.style.width = `${width}px`;
        this.component.element.style.height = `${height}px`;
    }

    /**
     * 初期位置を設定する
     * @param left - 初期の left 値
     * @param top - 初期の top 値
     */
    private setInitialPosition(left: number, top: number): void {
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
}