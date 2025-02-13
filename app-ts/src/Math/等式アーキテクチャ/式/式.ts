export class 式 {
    private readonly _列: (I値|I二項演算子<I値,I値,I値>)[];
    public get 列() {return this._列;}
    private readonly _値列: I値[];
    private readonly _演算子列: I二項演算子<any,any,any>[];
    constructor(列: (I値|I二項演算子<any,any,any>)[]) {
        this._列 = 列;
        this._値列 = this.値を抽出する(列);
        this._演算子列 = this.演算子を抽出する(列);
    }

    private 値を抽出する(列: (I値|I二項演算子<any,any,any>)[]): I値[] {
        //偶数番目の要素を取り出す
        return 列.filter((v, i) => i % 2 == 0) as I値[];
    }

    private 演算子を抽出する(列: (I値|I二項演算子<any,any,any>)[]): I二項演算子<any,any,any>[] {
        //奇数番目の要素を取り出す
        return 列.filter((v, i) => i % 2 == 1) as I二項演算子<any,any,any>[];
    }

    public 変形(変形規則: I式変形コマンド): 式 {
        return 変形規則.実行(this);
    }
}