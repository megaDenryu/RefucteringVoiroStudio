import { I値 } from "../値/I値";
import { 二変数関数 } from "./n変数関数";

export interface I二項演算子<T1 extends I値, T2 extends I値, O extends I値> {
    二項演算: 二変数関数<T1, T2, O>;
}