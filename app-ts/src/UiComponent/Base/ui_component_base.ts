import { Interface } from "readline";
import { ExtendFunction } from "../../Extend/extend";
import { Vertex, Cluster, Arrow} from "../../Math/GrapgTheory/graph";

export class ElementCreater {
    /**
     * HTMLElement: 単一のHTML要素を表し、その要素に対して操作を行うためのオブジェクト。
     * HTMLCollection: 複数のHTMLElementをまとめた動的コレクションで、リアルタイムにDOMツリーの変化を反映する。
     * Document: Webページ全体を表すオブジェクトで、DOMツリーのエントリーポイント。
     * 
     * これらを文字列から生成するためのクラス。
     */

    static domParser = new DOMParser();

    /**
     * htmlの文字列からそれと同じHTMLElementを生成する。ただし、htmlの文字列は1つの要素であること。（1つの要素の中に複数の子要素がネストされている構造が許される）
     * 複数エレメントを含むhtml文字列をまとめて作りたい場合は createElementsFromHTMLSting() を使うこと。
     * 良い例:
     * <div class="output_text">
     *      <p>おはよう</p>
     * </div>'。
     * この場合output_textのdiv要素全体が返される。
     * 
     * ダメな例:
     * <div class="output_text1"><p>おはよう</p>'</div>
     * <div class="output_text2"><p>コンバンワ</p>'</div>
     */
    static createElementFromHTMLString(html: string, className: string | null = null, id: string | null = null): HTMLElement {
        const parsedDocument = ElementCreater.domParser.parseFromString(html, 'text/html');
        const firstChild = parsedDocument.body.firstChild;
        if (firstChild && firstChild instanceof HTMLElement) {
            return this.setClassNameAndId(firstChild, className, id);
        } else {
            throw new Error('Parsed element is not an HTMLElement or is null.');
        }
    }

    /**
     * 複数のエレメントを含むhtml文字列からそれと同じHTMLElementを生成する。
     * @param {string} html
     * @return {HTMLCollection} getElementsByClassName()で取得できるようなものと同じ型。
     */
    static createElementsFromHTMLString(html: string): HTMLCollection {
        const parsedDocument = ElementCreater.domParser.parseFromString(html, 'text/html');
        const children = parsedDocument.body.children;
        if (children && children instanceof HTMLCollection) {
            return children; // HTMLCollectionとして返す
        } else {
            throw new Error('Parsed elements are not an HTMLCollection.');
        }
    }

    /**
     * htmlの文字列からそれと同じDocumentを生成する。
     * @param {string} html
     * @return {Document}
     */
    static createNewDocumentFromHTMLString(html: string): Document {
        return ElementCreater.domParser.parseFromString(html, 'text/html');
    }

    /**
     * リストを受け取ってHTMLSelectElementを返す関数。
     * @param {Array<string>} options - セレクトボックスのオプションとして使用する文字列の配列。
     * @param {number | null} [size = null] - セレクトボックスのサイズ。nullの場合は指定しない。
     * @return {HTMLSelectElement} - 生成されたHTMLSelectElement。
     */
    static createSelectElement(options: string[], size: number | null = null): HTMLSelectElement {
        let selectElement = document.createElement('select');

        options.forEach(optionText => {
            const optionElement = document.createElement('option');
            optionElement.value = optionText;
            optionElement.textContent = optionText;
            selectElement.appendChild(optionElement);
        });

        if (size != null) { selectElement.size = size; }
        return selectElement;
    }

    static createButtonElement(text: string, onClick: () => void): HTMLButtonElement {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = text;
        buttonElement.onclick = onClick;
        return buttonElement;
    }

    static setClassNameAndId(element: HTMLElement, className: string | null = null, id: string | null = null): HTMLElement {
        if (className) { element.className = className; }
        if (id) { element.id = id; }
        return element;
    }

    static createSliderInputElement(min: number, max: number, step: number, value: number): HTMLInputElement {
        const sliderElement = document.createElement('input');
        sliderElement.type = 'range';
        sliderElement.min = min.toString();
        sliderElement.max = max.toString();
        sliderElement.step = step.toString();
        sliderElement.value = value.toString();
        return sliderElement;
    }
}

export interface IHasComponent {
    readonly component: BaseComponent;
}

export class ElementChildClass {
}

export interface HtmlElementInput<ClassNames extends Readonly<Record<string,string>> = Readonly<Record<string,string>>> {
    readonly HTMLElement: string | HTMLElement;
    readonly classNames: ClassNames;
}
export const HtmlElementInput = {
  new: <ClassNames extends Readonly<Record<string,string>>> (
    HTMLElement: string,
    classNames: ClassNames,
  ): HtmlElementInput<ClassNames> => ({
    HTMLElement, classNames
  })
} as const;

export class BaseComponent<ClassNames extends Readonly<Record<string,string>> = Readonly<Record<string,string>> > {
    id: string;
    element: HTMLElement;
    vertex: Vertex; // コンポーネントグラフでの頂点
    vertexViewContent: any; // コンポーネントグラフを描画するときの内容。何を入れるかは未定
    childCompositeCluster: CompositeComponentCluster | null = null;
    parentComponentCluster: CompositeComponentCluster | null = null;

    get ClassNames(): string[] {
        return Array.from(this.element.classList);
    }

    static actualClassNames(element: Element): string[] {
        return Array.from(element.classList);
    }

    constructor(HTMLElementInput: HTMLElement, addClassName: string[] = [], vertexViewContent: any | null = null) {
        this.id = ExtendFunction.uuid();
        this.element = HTMLElementInput;
        this.vertexViewContent = vertexViewContent;
        this.vertex = new Vertex(this.id, this, this.vertexViewContent);
        this.parentComponentCluster = null;
        this.addCSSClass(addClassName);
    }

    
    changeVertexViewContent(content: any): void {
        this.vertexViewContent = content;
    }

    static createElementByString(hTMLElementInput: string): BaseComponent {
        const element = ElementCreater.createElementFromHTMLString(hTMLElementInput);
        return new BaseComponent(element);
    }

    static createElement<ClassNames extends Readonly<Record<string,string>> = Readonly<Record<string,string>>> (hTMLElementInput :HtmlElementInput<ClassNames>) {
        const element = (typeof hTMLElementInput.HTMLElement === 'string') ? ElementCreater.createElementFromHTMLString(hTMLElementInput.HTMLElement) : hTMLElementInput.HTMLElement;
        // ClassNamesをチェック

        const classList: string[] = Object.values(hTMLElementInput.classNames);
        if (this.checkHasClasses(element,classList) === false) {
            console.error(element);
            console.error(classList);
            throw new Error('Class not found.');
        }
        return new BaseComponent<ClassNames>(element);
    }

    static checkHasClasses(element,classList: string[]): boolean {
        for (let i = 0; i < classList.length; i++) {
            element.getElementsByClassName(classList[i]);
            if (element.getElementsByClassName(classList[i]).length === 0) {
                return false
            }
        }
        return true;
    }

    
    registerComponentGraphEdge(arrow: Arrow, parentComponentCluster: CompositeComponentCluster): void {
        this.vertex.edges.push(arrow);
        this.parentComponentCluster = parentComponentCluster;
    }

    bindParentElement(parentElement: HTMLElement): void {
        parentElement.appendChild(this.element);
    }

  
    appendChildToElement(childComponent: BaseComponent, parentClass: string|null = null): void {
        if (parentClass == null) {
            this.element.appendChild(childComponent.element);
        }

        if (parentClass != null) {
            const parentElement = this.element.getElementsByClassName(parentClass)[0];
            if (parentElement == null) {
                // 親クラスが見つからなかった場合はコンソールにthis.elementを表示してエラーを出す
                console.error(this.element);
                throw new Error('Parent class not found.');
                
            }
            parentElement.appendChild(childComponent.element);
        }
        
    }

 
    createChildComponentCluster(): void {
        this.childCompositeCluster = new CompositeComponentCluster(this.vertex);
    }

 
    createArrowBetweenComponents(parent: IHasComponent, child: IHasComponent, parentClass: string|null = null): void {
        const parentComponent = parent.component
        const childComponent = child.component
        if (this.childCompositeCluster == null) this.createChildComponentCluster();
        if (this.childCompositeCluster == null) throw new Error('childCompositeCluster is null.');
        this.childCompositeCluster.createArrowBetweenComponents(parentComponent, childComponent, parentClass);
    }

    setCSSClass(classNames: string[] | string): void {
        if (typeof classNames === 'string') {
            this.element.className = classNames;
        } else {
            this.element.className = classNames.join(' ');
        }
        
    }

    addCSSClass(classNames: string[] | string): void {
        if (typeof classNames === 'string') {
            this.element.classList.add(classNames);
        } else {
            this.element.classList.add(...classNames)
        }
    }


    removeCSSClass(classNames: string[] | string): void {
        if (typeof classNames === 'string') {
            this.element.classList.remove(classNames);
        } else {
            this.element.classList.remove(...classNames);
        }
    }

    show(): void {
        this.element.style.display = 'block';
    }

    hide(): void {
        this.element.style.display = 'none';
    }

    setZIndex(zIndex: number): void {
        this.element.style.zIndex = zIndex.toString();
    }
}

export class CompositeComponentCluster {
    cluster: Cluster;


    constructor(vertex: Vertex) {
        this.cluster = new Cluster(vertex);
    }

    /**
     * ２つのコンポーネントを矢印で結んで親子関係を作る。
     */
    createArrowBetweenComponents(parentComponent: BaseComponent, childComponent: BaseComponent, parentClass:string|null = null): void {
        const arrow = new Arrow(parentComponent.vertex, childComponent.vertex, null);
        this.cluster.graph.addEdge(arrow);
        // コンポーネントのedgesにarrowを追加
        parentComponent.registerComponentGraphEdge(arrow, this);
        childComponent.registerComponentGraphEdge(arrow, this);
        // 親コンポーネントのhtml要素に子コンポーネントのhtml要素を追加
        parentComponent.appendChildToElement(childComponent,parentClass);
    }
}