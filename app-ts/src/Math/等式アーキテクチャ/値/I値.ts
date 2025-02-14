import { I二項演算子 } from "../演算/I二項演算子";
import { 一変数関数 } from "../演算/n変数関数";

export interface I値 {
    値: any;
    実行: (二項演算: I二項演算子<I値,I値,I値>) => 一変数関数<I値,I値>; // 二項演算をカリー化して一変数関数を返す
}