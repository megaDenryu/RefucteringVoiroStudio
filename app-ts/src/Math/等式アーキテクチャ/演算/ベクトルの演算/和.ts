import { ベクトル } from "../../値/ベクトル";
import { I二項演算子 } from "../I二項演算子";

export const 和: I二項演算子<ベクトル, ベクトル, ベクトル> = {
    二項演算: function(x: ベクトル, y: ベクトル): ベクトル {
        if (x.次元 != y.次元) {throw new Error("次元が違う");}
        let z:number[] = [];
        for (let i = 0; i < x.次元; i++) {
            z.push(x.値[i] + y.値[i]);
        }
        return new ベクトル(z);
    }
}