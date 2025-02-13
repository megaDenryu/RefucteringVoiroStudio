export interface I式 {
    列: (I値|I二項演算子<any,any,any>)[];
    変形: (変形規則: I式変形コマンド) => I式;
}