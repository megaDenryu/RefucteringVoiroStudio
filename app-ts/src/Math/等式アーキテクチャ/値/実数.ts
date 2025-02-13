export class 実数 implements I値 {
    値: number;
    constructor(値: number) {
        this.値 = 値;
    }
    _(二項演算: I二項演算子<実数,I値,I値>): 一変数関数<I値,I値> {
        return (x: I値) => {
            return 二項演算.二項演算(this, x);
        }
    }
}