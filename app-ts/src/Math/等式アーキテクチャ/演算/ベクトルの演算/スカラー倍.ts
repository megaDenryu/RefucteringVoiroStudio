import { ベクトル } from "../../値/ベクトル";
import { 実数 } from "../../値/実数";
import { I二項演算子 } from "../I二項演算子";

export const スカラー倍: I二項演算子<実数, ベクトル, ベクトル> = {
    二項演算: function(x: 実数, y: ベクトル): ベクトル {
        let z = y.値.map((v) => x.値 * v);
        return new ベクトル(z);
    }
}