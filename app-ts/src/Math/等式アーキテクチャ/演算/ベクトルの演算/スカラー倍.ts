export const スカラー倍: I二項演算子<実数, ベクトル, ベクトル> = {
    二項演算: function(x: 実数, y: ベクトル): ベクトル {
        let z = y.値.map((v) => x.値 * v);
        return new ベクトル(z);
    }
}