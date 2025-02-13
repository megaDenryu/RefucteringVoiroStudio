
// interface I値 {
//     値: any;
//     実行: (二項演算: I二項演算子<I値,I値,I値>) => 一変数関数<I値,I値>; // 二項演算をカリー化して一変数関数を返す
// }


// type 一変数関数<T1 extends I値, O extends I値> = (x: T1) => O;
// type 二変数関数<T1 extends I値, T2 extends I値, O extends I値> = (x: T1, y: T2) => O;
// type 三変数関数<T1 extends I値, T2 extends I値, T3 extends I値, O extends I値> = (x: T1, y: T2, z: T3) => O;

// interface I二項演算子<T1 extends I値, T2 extends I値, O extends I値> {
//     二項演算: 二変数関数<T1, T2, O>;
// }

// class 実数 implements I値 {
//     値: number;
//     constructor(値: number) {
//         this.値 = 値;
//     }
//     実行(二項演算: I二項演算子<実数,I値,I値>): 一変数関数<I値,I値> {
//         return (x: I値) => {
//             return 二項演算.二項演算(this, x);
//         }
//     }
// }

// class ベクトル implements I値 {
//     値: number[];
//     次元: number;
//     constructor(値: number[]) {
//         this.値 = 値;
//         this.次元 = 値.length;
//     }
//     実行<T1 extends I値, O extends I値>(二項演算: I二項演算子<ベクトル, T1, O>): 一変数関数<T1, O> {
//         return (x: T1) => {
//             return 二項演算.二項演算(this, x);
//         }
//     }
// }


// class 内積演算子 implements I二項演算子<ベクトル, ベクトル, 実数> {
//     二項演算 = function(x: ベクトル, y: ベクトル): 実数 {
//         if (x.次元 != y.次元) {throw new Error("次元が違う");}
//         let sum = 0;
//         for (let i = 0; i < x.次元; i++) {
//             sum += x.値[i] * y.値[i];
//         }
//         return new 実数(sum);
//     };
// }

// const 内積1 = new 内積演算子();
// const 内積: I二項演算子<ベクトル, ベクトル, 実数> = {
//     二項演算 : function(x: ベクトル, y: ベクトル): 実数 {
//         if (x.次元 != y.次元) {throw new Error("次元が違う");}
//         let sum = 0;
//         for (let i = 0; i < x.次元; i++) {
//             sum += x.値[i] * y.値[i];
//         }
//         return new 実数(sum);
//     }
// }

// class 外積演算子 implements I二項演算子<ベクトル, ベクトル, ベクトル> {
//     二項演算: (x: ベクトル, y: ベクトル) => ベクトル;
    
//     constructor() {
//         this.二項演算 = this.外積;
//     }

//     private 外積(x: ベクトル, y: ベクトル): ベクトル{
//         if (x.次元 != 3 || y.次元 != 3) {throw new Error("次元が違う");}
//         let z = [
//             x.値[1] * y.値[2] - x.値[2] * y.値[1],
//             x.値[2] * y.値[0] - x.値[0] * y.値[2],
//             x.値[0] * y.値[1] - x.値[1] * y.値[0]
//         ];
//         return new ベクトル(z);
//     }
// }

// const 外積 = new 外積演算子();

// class ハミルトン積演算子 implements I二項演算子<ベクトル, ベクトル, クオータニオン> {
//     二項演算: (x: ベクトル, y: ベクトル) => クオータニオン;
//     constructor() {
//         this.二項演算 = this.ハミルトン積;
//     }

//     private ハミルトン積(x: ベクトル, y: ベクトル): クオータニオン{
//         if (x.次元 != 3 || y.次元 != 3) {throw new Error("次元が違う");}
//         return new クオータニオン({スカラー部: x.実行(内積)(y), ベクトル部: x.実行(外積)(y)});
//     }
// }

// const ハミルトン積 = new ハミルトン積演算子();

// //内積と外積からクオータニオンを作る
// class クオータニオン implements I値 {
//     値: {
//         スカラー部: 実数,
//         ベクトル部: ベクトル 
//     };
//     constructor(値: { スカラー部: 実数, ベクトル部: ベクトル}) {
//         this.値 = 値;
//     }
//     実行<T1 extends I値, O extends I値>(二項演算: I二項演算子<クオータニオン, T1, O>): 一変数関数<T1, O> {
//         return (x: T1) => {
//             return 二項演算.二項演算(this, x);
//         }   
//     }
// }



// function test() {
//     let  v = new ベクトル([1,2,3]);
//     let  w = new ベクトル([4,5,6]);
//     let dot = new 内積演算子();
//     let f = v.実行(dot)(w);

//     let cross = new 外積演算子();
//     let g = v.実行(cross)(w);

// }