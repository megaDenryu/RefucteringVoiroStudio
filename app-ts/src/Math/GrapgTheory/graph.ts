import { VectorN } from "../LinearAlgebra/vector";

export class Vertex {
    edges: Edge[] = [];
    id: number | string;
    data: any;
    viewContent: any;

    constructor(id: number | string, data: any, viewContent: any) {
        this.id = id;
        this.data = data;
        this.viewContent = viewContent;
    }

    getArrows(): Arrow[] {
        return this.edges.filter(edge => edge instanceof Arrow) as Arrow[];
    }

    isParent(vertex: Vertex): boolean {
        const Arrows = this.getArrows();
        return Arrows.some(arrow => arrow.start === vertex);
    }

    isChild(vertex: Vertex): boolean {
        const Arrows = this.getArrows();
        return Arrows.some(arrow => arrow.end === vertex);
    }
}

export class Edge {
    vertex1: Vertex;
    vertex2: Vertex;
    weight: VectorN | null;

    constructor(vertex1: Vertex, vertex2: Vertex, weight: VectorN | null) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.weight = weight;
    }

    getContrastVertex(vertex: Vertex): Vertex {
        if (this.vertex1 === vertex) {
            return this.vertex2;
        } else {
            return this.vertex1;
        }
    }

    static create0WeightEdge(vertex1: Vertex, vertex2: Vertex): Edge {
        const weight: VectorN = new VectorN([1,1,1,1]);
        return new Edge(vertex1, vertex2, weight);
    }
}

export class Arrow extends Edge {
    start: Vertex;
    end: Vertex;

    constructor(vertex_start: Vertex, vertex_end: Vertex, weight: VectorN | null) {
        super(vertex_start, vertex_end, weight);
        this.start = vertex_start;
        this.end = vertex_end;
    }
}


export class Graph {
    vertices: Record<Vertex["id"], Vertex> = {};
    edges: Edge[] = [];
    isDirected: boolean;

    constructor(isDirected = false) {
        this.isDirected = isDirected;
    }

    addVertex(vertex: Vertex): void {
        this.vertices[vertex.id] = vertex;
    }

    addEdge(edge: Edge): void {
        this.edges.push(edge);
    }

    // その他のグラフ操作メソッド...
}

export class Cluster {
    /**
     * グラフ全体を1つの頂点として扱うためのクラス。
     * クラスターのグラフを格子柄したいときは、クラスターの頂点をグラフに登録してグラフを作ればよい。そうすると、それはただのグラフなので問題はない。
     */
    graph: Graph;
    selfAsVertex: Vertex;

    constructor(vertex: Vertex) {
        this.graph = new Graph();
        this.selfAsVertex = vertex;
        this.bindVertex();
    }

    static constructor2(id: number | string, data: any, viewContent: any): Cluster {
        const selfAsVertex = new Vertex(id, data, viewContent);
        return new Cluster(selfAsVertex);
    }

    bindVertex(): void {
        this.selfAsVertex.data = this;
    }
}

export class GraphView {
    graph: Graph;

    constructor(graph: Graph) {
        this.graph = graph;
    }

    // グラフを描画するメソッド...
}