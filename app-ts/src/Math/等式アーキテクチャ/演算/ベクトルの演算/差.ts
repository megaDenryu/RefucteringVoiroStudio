import { ベクトル } from "../../値/ベクトル";
import { 実数 } from "../../値/実数";
import { I二項演算子 } from "../I二項演算子";
import { スカラー倍 } from "./スカラー倍";
import { 和 } from "./和";

export const 差: I二項演算子<ベクトル, ベクトル, ベクトル> = {
    二項演算: function(x: ベクトル, y: ベクトル): ベクトル {
        return 和.二項演算(x, スカラー倍.二項演算(new 実数(-1), y));
    }
}