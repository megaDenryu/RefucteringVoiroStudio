// Union型から配列を生成するユーティリティ型
type UnionToArray<T> = T extends any ? T[] : never;

export class SelecterFromEnum<T extends any> {
    // Union型から生成した候補の配列
    readonly 候補: UnionToArray<T>;
    
    private _値: T;

    constructor(初期値: T, 全候補: T[]) {
        // Union型から配列を生成
        this.候補 = 全候補 as UnionToArray<T>;
        if (!this.候補.includes(初期値)) {
            throw new Error(`${初期値}は候補${this.候補.join(', ')}に含まれていません`);
        }        
        this._値 = 初期値;
    }

    // 値のゲッター
    get 値(): T {
        return this._値;
    }

    // 値のセッター（候補の検証付き）
    set 値(新しい値: T) {
        if (!this.候補.includes(新しい値)) {
            throw new Error(`${新しい値}は候補${this.候補.join(', ')}に含まれていません`);
        }
        this._値 = 新しい値;
    }
}


abstract class EnumClass {
    static candidate: readonly any[];
    static type: typeof this.candidate[number];
}

class EmotionEnum extends EnumClass {
    static readonly candidate = ["悲しい", "嬉しい", 1] as const;
    type: typeof EmotionEnum.candidate[number];
    static readonly 悲しい: EmotionEnum["type"] = "悲しい";
}

let a: EmotionEnum["type"] = "悲しい";
const b: EmotionEnum["type"][] = [EmotionEnum.悲しい, "嬉しい", 1];

