import { 式old } from "../式";

export interface I式変形コマンド {
    実行: (v式: 式old) => 式old;
}