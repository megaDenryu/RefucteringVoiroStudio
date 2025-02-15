import { I二項演算子 } from "../演算/I二項演算子";
import { 一変数関数 } from "../演算/n変数関数";
import { I値 } from "./I値";

export class ベクトル implements I値 {
    値: number[];
    次元: number;
    constructor(値: number[]) {
        this.値 = 値;
        this.次元 = 値.length;
    }
    実行<T1 extends I値, O extends I値>(二項演算: I二項演算子<ベクトル, T1, O>): 一変数関数<T1, O> {
        return (x: T1) => {
            return 二項演算.二項演算(this, x);
        }
    }
}