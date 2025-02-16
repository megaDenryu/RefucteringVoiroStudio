import { I値 } from "../値/I値";
import { I二項演算子 } from "../演算/I二項演算子";
import { I式変形コマンド } from "./式変形コマンド/I式変形コマンド";

export interface I式old {
    列: (I値|I二項演算子<any,any,any>)[];
    変形: (変形規則: I式変形コマンド) => I式old;
}


export interface I式 {
    変形: (変形規則: I式変形コマンド) => I式;
}
