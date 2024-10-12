import { ExtendFunction } from "../Extend/extend";
import { Vertex, Cluster, Arrow} from "../Math/GrapgTheory/graph";

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
        const selectElement = document.createElement('select');

        options.forEach(optionText => {
            const optionElement = document.createElement('option');
            optionElement.value = optionText;
            optionElement.textContent = optionText;
            selectElement.appendChild(optionElement);
        });

        if (size != null) { selectElement.size = size; }

        return selectElement;
    }

    static setClassNameAndId(element: HTMLElement, className: string | null = null, id: string | null = null): HTMLElement {
        if (className) { element.className = className; }
        if (id) { element.id = id; }
        return element;
    }
}

export class BaseComponent {
    className: string[];
    id: string;
    element: HTMLElement;
    vertex: Vertex; // コンポーネントグラフでの頂点
    vertexViewContent: any; // コンポーネントグラフを描画するときの内容。何を入れるかは未定
    childCompositeCluster: CompositeComponentCluster | null = null;
    parentComponentCluster: CompositeComponentCluster | null = null;

    constructor(HTMLElementInput: string | HTMLElement, className: string[] = [], vertexViewContent: any | null = null) {
        this.className = className;
        this.id = ExtendFunction.uuid();
        this.element = this.createElement(HTMLElementInput);
        this.vertexViewContent = vertexViewContent;
        this.vertex = new Vertex(this.id, this, this.vertexViewContent);
        this.parentComponentCluster = null;
    }

    
    changeVertexViewContent(content: any): void {
        this.vertexViewContent = content;
    }

    createElement(HTMLElementInput: string | HTMLElement): HTMLElement {
        if (HTMLElementInput instanceof HTMLElement) {
            return HTMLElementInput;
        } else if (typeof HTMLElementInput === 'string') {
            return ElementCreater.createElementFromHTMLString(HTMLElementInput);
        } else {
            throw new Error('HTMLElementInput is not a string or HTMLElement.');
        }
    }

    
    registerComponentGraphEdge(arrow: Arrow, parentComponentCluster: CompositeComponentCluster): void {
        this.vertex.edges.push(arrow);
        this.parentComponentCluster = parentComponentCluster;
    }

  
    appendChildToElement(childComponent: BaseComponent): void {
        this.element.appendChild(childComponent.element);
    }

 
    createChildComponentCluster(): void {
        this.childCompositeCluster = new CompositeComponentCluster(this.vertex);
    }

 
    createArrowBetweenComponents(parentComponent: BaseComponent, childComponent: BaseComponent): void {
        if (this.childCompositeCluster == null) this.createChildComponentCluster();
        if (this.childCompositeCluster == null) throw new Error('childCompositeCluster is null.');
        this.childCompositeCluster.createArrowBetweenComponents(parentComponent, childComponent);
    }


    addCSSClass(classNames: string[] | string): void {
        if (typeof classNames === 'string') {
            this.className.push(classNames);
            this.element.className = classNames;
        } else {
            this.className.push(...classNames);
            this.element.className = classNames.join(' ');
        }
    }


    removeCSSClass(classNames: string[] | string): void {
        if (typeof classNames === 'string') {
            this.className = this.className.filter(className => className !== classNames);
            this.element.className = this.className.join(' ');
        } else {
            this.className = this.className.filter(className => !classNames.includes(className));
            this.element.className = this.className.join(' ');
        }
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
    createArrowBetweenComponents(parentComponent: BaseComponent, childComponent: BaseComponent): void {
        const arrow = new Arrow(parentComponent.vertex, childComponent.vertex, null);
        this.cluster.graph.addEdge(arrow);
        // コンポーネントのedgesにarrowを追加
        parentComponent.registerComponentGraphEdge(arrow, this);
        childComponent.registerComponentGraphEdge(arrow, this);
        // 親コンポーネントのhtml要素に子コンポーネントのhtml要素を追加
        parentComponent.appendChildToElement(childComponent);
    }
}