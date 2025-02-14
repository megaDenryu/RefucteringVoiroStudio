import { ベクトル } from "../等式アーキテクチャ/値/ベクトル";
import { 式old } from "../等式アーキテクチャ/式/式";
import { 等式old } from "../等式アーキテクチャ/式/等式";
import { ハミルトン積 } from "../等式アーキテクチャ/演算/ベクトルの演算/ハミルトン積";
import { 内積 } from "../等式アーキテクチャ/演算/ベクトルの演算/内積";
import { 外積 } from "../等式アーキテクチャ/演算/ベクトルの演算/外積";








function test() {
    let  v = new ベクトル([1,2,3]);
    let  w = new ベクトル([4,5,6]);
    let f = v.実行(内積)(w);
    let g = v.実行(外積)(w);
    let h = v.実行(ハミルトン積)(w);

    let a = v.実行(外積)(w).実行(外積)(w).実行(外積)(w).実行(内積)(w);

    let f1: 式old = new 式old([v, 内積, w, 外積, w, 外積, w, 外積, w, 内積, w]);
    let f2: 式old = new 式old([v, 内積, w, 外積, w, 外積, w, 外積, w, 内積, w]);

    let eq = new 等式old(f1, f2);
    eq


    
}