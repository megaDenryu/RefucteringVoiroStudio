import { I式変形コマンド } from "../式変形コマンド/I式変形コマンド";
import { 等式old } from "../等式";
import { I等式変形コマンド } from "./I等式変形コマンド";

export class 両辺に同じ操作を行う implements I等式変形コマンド {
    操作: I式変形コマンド;
    constructor(操作: I式変形コマンド) {
        this.操作 = 操作;
    }
    実行(v等式: 等式old): 等式old {
        return new 等式old(this.操作.実行(v等式.左辺), this.操作.実行(v等式.右辺));
    }
}