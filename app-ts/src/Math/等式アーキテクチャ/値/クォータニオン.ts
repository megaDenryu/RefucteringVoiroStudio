import { I二項演算子 } from "../演算/I二項演算子";
import { 一変数関数 } from "../演算/n変数関数";
import { I値 } from "./I値";
import { ベクトル } from "./ベクトル";
import { 実数 } from "./実数";

//内積と外積からクオータニオンを作る
export class クオータニオン implements I値 {
    値: {
        スカラー部: 実数,
        ベクトル部: ベクトル 
    };
    constructor(値: { スカラー部: 実数, ベクトル部: ベクトル}) {
        this.値 = 値;
    }
    実行<T1 extends I値, O extends I値>(二項演算: I二項演算子<クオータニオン, T1, O>): 一変数関数<T1, O> {
        return (x: T1) => {
            return 二項演算.二項演算(this, x);
        }
    }
}