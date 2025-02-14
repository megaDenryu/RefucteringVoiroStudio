import { クオータニオン } from "../../値/クォータニオン";
import { ベクトル } from "../../値/ベクトル";
import { I二項演算子 } from "../I二項演算子";
import { 内積 } from "./内積";
import { 外積 } from "./外積";

export const ハミルトン積: I二項演算子<ベクトル, ベクトル, クオータニオン> = {
    二項演算: function(x: ベクトル, y: ベクトル): クオータニオン {
        if (x.次元 != 3 || y.次元 != 3) {throw new Error("次元が違う");}
        return new クオータニオン({スカラー部: x.実行(内積)(y), ベクトル部: x.実行(外積)(y)});
    }
}
