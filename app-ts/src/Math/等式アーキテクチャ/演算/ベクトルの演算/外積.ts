import { ベクトル } from "../../値/ベクトル";
import { I二項演算子 } from "../I二項演算子";

export const 外積: I二項演算子<ベクトル, ベクトル, ベクトル> = {
    二項演算: function(x: ベクトル, y: ベクトル): ベクトル {
        if (x.次元 != 3 || y.次元 != 3) {throw new Error("次元が違う");}
        let z = [
            x.値[1] * y.値[2] - x.値[2] * y.値[1],
            x.値[2] * y.値[0] - x.値[0] * y.値[2],
            x.値[0] * y.値[1] - x.値[1] * y.値[0]
        ];
        return new ベクトル(z);
    }
}