// ノードを表すクラス
class GNode {
    private static counter = 0; // 一意なID生成用
    public id: number; // ノードの識別子
    public name: string; // ノードの名前
    public x: number; // x座標
    public y: number; // y座標
    public element: SVGGElement; // SVGのグループ要素
    private diagram: Diagram; // 親のDiagramインスタンス
    private inputElement: HTMLInputElement; // 入力フィールド

    constructor(name: string, x: number, y: number, diagram: Diagram) {
        this.id = GNode.counter++;
        this.name = name;
        this.x = x;
        this.y = y;
        this.diagram = diagram;

        // SVGの<g>要素を作成（グループ化）
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.element.setAttribute("transform", `translate(${this.x}, ${this.y})`);

        // 円を作成
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("r", "20");
        circle.setAttribute("fill", "lightblue");
        this.element.appendChild(circle);

        // foreignObjectを作成してHTMLのinputを埋め込む
        const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        foreignObject.setAttribute("width", "100");
        foreignObject.setAttribute("height", "20");
        foreignObject.setAttribute("x", "-50");
        foreignObject.setAttribute("y", "-10");

        // HTMLのinput要素を作成
        this.inputElement = document.createElement("input");
        this.inputElement.type = "text";
        this.inputElement.value = this.name;
        this.inputElement.style.width = "100px";
        this.inputElement.style.textAlign = "center";
        this.inputElement.addEventListener("input", this.updateName.bind(this));

        // foreignObjectにinputを追加
        foreignObject.appendChild(this.inputElement);
        this.element.appendChild(foreignObject);

        // ドラッグイベントを追加
        circle.addEventListener("mousedown", this.startDrag.bind(this));
    }

    // ノードの位置を更新
    public updatePosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.element.setAttribute("transform", `translate(${this.x}, ${this.y})`);
        this.diagram.updateArrows(); // 関連する矢印を更新
    }

    // ドラッグ開始
    private startDrag(event: MouseEvent) {
        event.preventDefault(); // デフォルトのドラッグ動作を防ぐ
        document.addEventListener("mousemove", this.drag.bind(this));
        document.addEventListener("mouseup", this.endDrag.bind(this), { once: true }); // 一度だけ実行
    }

    // ドラッグ中
    private drag(event: MouseEvent) {
        this.updatePosition(event.clientX, event.clientY);
    }

    // ドラッグ終了
    private endDrag() {
        document.removeEventListener("mousemove", this.drag.bind(this));
        // "mouseup"リスナーは{ once: true }で自動的に解除される
    }

    // 名前を更新
    private updateName() {
        this.name = this.inputElement.value;
    }
}

// 矢印を表すクラス
class Arrow {
    public from: GNode; // 始点ノード
    public to: GNode; // 終点ノード
    public element: SVGLineElement; // SVGの線要素

    constructor(from: GNode, to: GNode) {
        this.from = from;
        this.to = to;

        // SVGの<line>要素を作成
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.update(); // 初期位置を設定
    }

    // 矢印の位置を更新
    public update() {
        this.element.setAttribute("x1", this.from.x.toString());
        this.element.setAttribute("y1", this.from.y.toString());
        this.element.setAttribute("x2", this.to.x.toString());
        this.element.setAttribute("y2", this.to.y.toString());
        this.element.setAttribute("stroke", "black");
        this.element.setAttribute("stroke-width", "2");
    }
}

// 全体を管理するクラス
class Diagram {
    private nodes: GNode[] = []; // ノードのリスト
    private arrows: Arrow[] = []; // 矢印のリスト
    private svg: SVGSVGElement; // SVGコンテナ

    constructor() {
        // SVG要素を作成
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("width", "800");
        this.svg.setAttribute("height", "600");
        document.body.appendChild(this.svg); // DOMに追加
    }

    // ノードを追加
    public addNode(name: string, x: number, y: number) {
        const node = new GNode(name, x, y, this);
        this.nodes.push(node);
        this.svg.appendChild(node.element);
        return node; // 追加したノードを返す
    }

    // 矢印を追加
    public addArrow(from: GNode, to: GNode) {
        const arrow = new Arrow(from, to);
        this.arrows.push(arrow);
        this.svg.appendChild(arrow.element);
    }

    // 全ての矢印を更新
    public updateArrows() {
        this.arrows.forEach(arrow => arrow.update());
    }
}

// 使用例
const diagram = new Diagram();
const node1 = diagram.addNode("Node1", 100, 100); // ノード1を追加
const node2 = diagram.addNode("Node2", 200, 200); // ノード2を追加
diagram.addArrow(node1, node2); // ノード1からノード2への矢印を追加