































export interface I式変形コマンド {
    実行: (v式: 式) => 式;
}

export class 式に挿入する implements I式変形コマンド {
    挿入位置: number; //負の値は末尾
    挿入値: I値|I二項演算子<any,any,any>;
    constructor(挿入位置: number, 挿入値: I値|I二項演算子<any,any,any>) {
        this.挿入位置 = 挿入位置;
        this.挿入値 = 挿入値;
    }
    実行(v式: I式): 式 {
        let 列 = [...v式.列];
        列.splice(this.挿入位置, 0, this.挿入値);
        return new 式(列);
    }
}

export const 式末尾に挿入 = new 式に挿入する(-1, new 実数(0));
export const 式先頭に挿入 = new 式に挿入する(0, new 実数(0));

export class 等式 {
    左辺: 式;
    右辺: 式;
    constructor(左辺: 式, 右辺: 式) {
        this.左辺 = 左辺;
        this.右辺 = 右辺;
    }
}

export interface I等式変形コマンド {
    実行: (v等式: 等式) => 等式;
}

export class 両辺に同じ操作を行う implements I等式変形コマンド {
    操作: I式変形コマンド;
    constructor(操作: I式変形コマンド) {
        this.操作 = 操作;
    }
    実行(v等式: 等式): 等式 {
        return new 等式(this.操作.実行(v等式.左辺), this.操作.実行(v等式.右辺));
    }
}

function test() {
    let  v = new ベクトル([1,2,3]);
    let  w = new ベクトル([4,5,6]);
    let f = v._(内積)(w);
    let g = v._(外積)(w);
    let h = v._(ハミルトン積)(w);

    let a = v._(外積)(w)._(外積)(w)._(外積)(w)._(内積)(w);

    let f1: 式 = new 式([v, 内積, w, 外積, w, 外積, w, 外積, w, 内積, w]);
    let f2: 式 = new 式([v, 内積, w, 外積, w, 外積, w, 外積, w, 内積, w]);

    let eq = new 等式(f1, f2);
    eq


    
}