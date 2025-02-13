export const 内積: I二項演算子<ベクトル, ベクトル, 実数> = {
    二項演算 : function(x: ベクトル, y: ベクトル): 実数 {
        if (x.次元 != y.次元) {throw new Error("次元が違う");}
        let sum = 0;
        for (let i = 0; i < x.次元; i++) {
            sum += x.値[i] * y.値[i];
        }
        return new 実数(sum);
    }
}