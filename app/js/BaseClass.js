///@ts-check



class VectorN {
    /** @type {number[]} */array;

    /** @param {number[]} array */
    constructor(array) {
        this.array = array;
    }

    /** @param {VectorN} v */
    plus(v) {
        return new VectorN(this.array.map((x, i) => x + v.array[i]));
    }

    /** @param {VectorN} v */
    minus(v) {
        return new VectorN(this.array.map((x, i) => x - v.array[i]));
    }

    /** @param {number} k */
    times(k) {
        return new VectorN(this.array.map(x => x * k));
    }

    /** @param {number} k */
    divide(k) {
        return new VectorN(this.array.map(x => x / k));
    }

    /** @param {VectorN} v */
    dot(v) {
        return this.array.reduce((sum, x, i) => sum + x * v.array[i], 0);
    }
}

class Vertex {

    /** @type {Edge[]} */ edges = [];
    /** @type {number|string} */ id;
    /** @type {any} */ data;
    /** @type {any} */ viewContent;

    /**
     * @param {number|string} id
     * @param {any} data
    */
    constructor(id, data, viewContent) {
      this.id = id;
      this.data = data;
    }

    /** @return {Arrow[]} */
    getArrows() {
        // @ts-ignore
        return this.edges.filter(edge => edge instanceof Arrow);
    }

    /** @param {Vertex} vertex */
    isParent(vertex) {
        const Arrows = this.getArrows();
        return Arrows.some(arrow => arrow.start === vertex);
    }

    /** @param {Vertex} vertex */
    isChild(vertex) {
        const Arrows = this.getArrows();
        return Arrows.some(arrow => arrow.end === vertex);
    }

    
}
  
class Edge {
    /** @type {Vertex} */ vertex1;
    /** @type {Vertex} */ vertex2;
    /** @type {VectorN|null} */ weight;

    /**
     * @param {Vertex} vertex1 
     * @param {Vertex} vertex2 
     * @param {VectorN|null} weight 
     * */
    constructor(vertex1, vertex2, weight) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.weight = weight;
    }

    /** 
     * @param {Vertex} vertex
     * @return {Vertex}
     * */
    getContrastVertex(vertex) {
        if (this.vertex1 === vertex) {
            return this.vertex2;
        } else {
            return this.vertex1;
        }
    }

    
}

class Arrow extends Edge {
    /** @type {Vertex} */ start;
    /** @type {Vertex} */ end;

    /**
     * 
     * @param {Vertex} vertex_start 
     * @param {Vertex} vertex_end
     * @param {VectorN|null} weight 
     */
    constructor(vertex_start, vertex_end, weight) {
        super(vertex_start, vertex_end, weight);
        this.start = vertex_start;
        this.end = vertex_end;
    }


}
  
class Graph {
    /** @type { Record<Vertex["id"],Vertex> } */ vertices = {};
    /** @type {Edge[]} */ edges = [];
    /** @type {boolean} */ isDirected    // 
    
    constructor(isDirected = false) {
        this.isDirected = isDirected;
    }

    /** @param {Vertex} vertex*/
    addVertex(vertex) {
      this.vertices[vertex.id] = vertex;
    }
  
    /** @param {Edge} edge */
    addEdge(edge) {
      this.edges.push(edge);
    }
  
    // その他のグラフ操作メソッド...
}

class Cluster {
    /**
     * グラフ全体を1つの頂点として扱うためのクラス。
     * クラスターのグラフを格子柄したいときは、クラスターの頂点をグラフに登録してグラフを作ればよい。そうすると、それはただのグラフなので問題はない。
     * 
     */

    /** @type {Graph} */ graph;
    /** @type {Vertex} */  selfAsVertex; //グラフ全体を1つの頂点として扱うための頂点

    /** @param {Vertex} vertex */
    constructor(vertex) {
        this.graph = new Graph();
        this.selfAsVertex = vertex;
        this.bindVertex(); //自分自身を頂点のデータとして登録しクラスターグラフから頂点としてのこのクラスターを参照できるようにする。
        
    }

    /**
     * @param {number|string} id
     * @param {any} data
     * @return {Cluster}
    */
    static constructor2(id, data, viewContent) {
        const selfAsVertex = new Vertex(id, data, viewContent);
        return new Cluster(selfAsVertex);
    }

    bindVertex() {
        this.selfAsVertex.data = this;
    }
}
  
class GraphView {
    /** @type {Graph} */
    graph;

    /**
     * @param {Graph} graph
     **/
    constructor(graph) {
      this.graph = graph;
    }
  
    // グラフを描画するメソッド...
}



class ElementCreater {
    /**
     * HTMLElement: 単一のHTML要素を表し、その要素に対して操作を行うためのオブジェクト。
     * HTMLCollection: 複数のHTMLElementをまとめた動的コレクションで、リアルタイムにDOMツリーの変化を反映する。
     * Document: Webページ全体を表すオブジェクトで、DOMツリーのエントリーポイント。
     * 
     * これらを文字列から生成するためのクラス。
     */

    static domParser = new DOMParser();

    /**
     * 
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
     * @param {string} html 
     * @param {string|null} [className=null]
     * @param {string|null} [id=null]
     * @return {HTMLElement}
     */
    static createElementFromHTMLString(html,className = null, id = null) {
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
    static createElementsFromHTMLString(html) {
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
    static createNewDocumentFromHTMLString(html) {
        return ElementCreater.domParser.parseFromString(html, 'text/html');
    }


    /**
     * リストを受け取ってHTMLSelectElementを返す関数。
     * @param {Array<string>} options - セレクトボックスのオプションとして使用する文字列の配列。
     * @param {Number | null} [size = null] - セレクトボックスのサイズ。nullの場合は指定しない。
     * @return {HTMLSelectElement} - 生成されたHTMLSelectElement。
     */
    static createSelectElement(options, size = null) {
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

    /**
     * @param {HTMLElement} element
     * @param {string|null} [className=null]
     * @param {string|null} [id=null]
     * @return {HTMLElement}
     */
    static setClassNameAndId(element, className = null, id = null) {
        if (className) { element.className = className; }
        if (id) { element.id = id; }
        return element;
    }
}



class BaseComponent {
    /** @type {string[]} */          className;
    /** @type {string} */               id;
    /** @type {HTMLElement} */          element;
    /** @type {Vertex}*/                vertex; //コンポーネントグラフでの頂点
    /** @type {any} */                  vertexViewContent; //コンポーネントグラフを描画するときの内容。何を入れるかは未定
    /** @type {CompositeComponentCluster|null} */ childCompositeCluster = null;
    /** @type {CompositeComponentCluster|null} */ parentComponentCluster = null;


    /**
     * @param {string | HTMLElement} HTMLElementInput
     * @param {string[]} className
     * @param {any | null} [vertexViewContent=null]
     */
    constructor(HTMLElementInput, className = [], vertexViewContent = null) {
        this.className = className;
        this.id = ExtendFunction.uuid()
        this.element = this.createElement(HTMLElementInput);
        this.vertexViewContent = vertexViewContent;
        this.vertex = new Vertex(this.id, this, this.vertexViewContent);
        this.parentComponentCluster = null;
    }

    /**
     * @param {any} content
     * @return {void}
     */
    changeVertexViewContent(content) {
        this.vertexViewContent = content;
    }

    /**
     * @param {string | HTMLElement} HTMLElementInput
     * @return {HTMLElement}
     */
    createElement(HTMLElementInput) {
        if (HTMLElementInput instanceof HTMLElement) {
            return HTMLElementInput;
        } else if (typeof HTMLElementInput === 'string') {
            return ElementCreater.createElementFromHTMLString(HTMLElementInput);
        } else {
            throw new Error('HTMLElementInput is not a string or HTMLElement.');
        }
    }

    /**
     * @param {Arrow} arrow
     * @param {CompositeComponentCluster} parentComponentCluster
     * 
     **/
    registerComponentGraphEdge(arrow, parentComponentCluster) {
        this.vertex.edges.push(arrow);
        this.parentComponentCluster = parentComponentCluster;
    }

    /**
     * @param {BaseComponent} childComponent
     */
    appendChildToElement(childComponent) {
        this.element.appendChild(childComponent.element);
    }

    /**
     * childComponentClusterを作成し、それを親子関係として登録する。
     */
    createChildComponentCluster() {
        this.childCompositeCluster = new CompositeComponentCluster(this.vertex);
    }

    /**
     * ２つのコンポーネントを矢印で結んで親子関係を作る。
     * @param {BaseComponent} parentComponent
     * @param {BaseComponent} childComponent
     */
    createArrowBetweenComponents(parentComponent, childComponent) {
        if (this.childCompositeCluster == null) this.createChildComponentCluster();
        if (this.childCompositeCluster == null) throw new Error('childCompositeCluster is null.');
        this.childCompositeCluster.createArrowBetweenComponents(parentComponent, childComponent);
    }

    /**
     * @param {string[]|String} classNames
     * @return {void}
     **/
    addCSSClass(classNames) {
        if (typeof classNames === 'string') {
            this.className.push(classNames);
            this.element.className = classNames;
        } else {
            this.className.push(...classNames);
            this.element.className = classNames.join(' ');
        }
    }

    /**
     * @param {string[]|string} classNames
     * @return {void}
     * */
    removeCSSClass(classNames) {
        if (typeof classNames === 'string') {
            this.className = this.className.filter(className => className !== classNames);
            this.element.className = this.className.join(' ');
        } else {
            this.className = this.className.filter(className => !classNames.includes(className));
            this.element.className = this.className.join(' ');
        }
    }



    

}

class CompositeComponentCluster{
    /** @type {Cluster} */ cluster;
    
    /**
     * 
     * @param {Vertex} vertex 
     */
    constructor(vertex){
        this.cluster = new Cluster(vertex);
    }

    /**
     * ２つのコンポーネントを矢印で結んで親子関係を作る。
     * @param {BaseComponent} parentComponent
     * @param {BaseComponent} childComponent
     */
    createArrowBetweenComponents(parentComponent, childComponent) {
        const arrow = new Arrow(parentComponent.vertex, childComponent.vertex, null);
        this.cluster.graph.addEdge(arrow);
        // コンポーネントのedgesにarrowを追加
        parentComponent.registerComponentGraphEdge(arrow, this);
        childComponent.registerComponentGraphEdge(arrow, this);
        // 親コンポーネントのhtml要素に子コンポーネントのhtml要素を追加
        parentComponent.appendChildToElement(childComponent);
    }

}


// export { BaseComponent, CompositeComponentCluster, ElementCreater, Graph, GraphView, Vertex, Edge, Arrow, VectorN };