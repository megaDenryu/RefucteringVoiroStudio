import { I値 } from "../../値/I値";
import { 実数 } from "../../値/実数";
import { I二項演算子 } from "../../演算/I二項演算子";
import { I式old } from "../I式";
import { 式old } from "../式";
import { I式変形コマンド } from "./I式変形コマンド";

export class 式に挿入する implements I式変形コマンド {
    挿入位置: number; //負の値は末尾
    挿入値: I値|I二項演算子<any,any,any>;
    constructor(挿入位置: number, 挿入値: I値|I二項演算子<any,any,any>) {
        this.挿入位置 = 挿入位置;
        this.挿入値 = 挿入値;
    }
    実行(v式: I式old): 式old {
        let 列 = [...v式.列];
        列.splice(this.挿入位置, 0, this.挿入値);
        return new 式old(列);
    }
}

export const 式末尾に挿入 = new 式に挿入する(-1, new 実数(0));
export const 式先頭に挿入 = new 式に挿入する(0, new 実数(0));