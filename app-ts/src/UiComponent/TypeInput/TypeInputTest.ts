import { SelecterFromEnum } from "../../Extend/OriginalEnum";
import { SquareBoardComponent } from "../Board/SquareComponent";
import { InputObjectBoard } from "./InputObjectBoard";
import { EnumInputComponent } from "./TypeComponents/EnumInputComponent/EnumInputComponent";
import { NumberInputComponent } from "./TypeComponents/NumberInputComponent/NumberInputComponent";

// let 板 = new SquareBoardComponent(1000,1000);
// document.body.appendChild(板.component.element);

namespace Enum {
    export namespace Emotion {
        const canditate = ["悲しい", "嬉しい", "怒り"] as const;
        export type Type = typeof canditate[number];
    }

    export namespace Rank {
        const canditate = ["S", "A", "B", "C", "D"] as const;
        export type Type = typeof canditate[number];
    }
}

namespace EnumClass {
    export type Type = typeof EnumClass.candidate[number];
}

namespace EnumClass {
    export type Type1 = typeof EnumClass.candidate[number];
}
abstract class EnumClass {
    static candidate: readonly any[];
}

namespace EmotionEnum {
    export type Type = typeof EmotionEnum.candidate[number];
}

class EmotionEnum extends EnumClass {
    static readonly candidate = ["悲しい", "嬉しい", "怒り"] as const;
    static readonly 悲しい: EmotionEnum.Type = "悲しい";   
    static readonly 嬉しい: EmotionEnum.Type = "嬉しい";
    static readonly 怒り: EmotionEnum.Type = "怒り";
}



class SelecterProxy {
    private readonly _candidate:any[];
    private _value:any;


}




// const selecter = new SelecterFromEnum<Emotion>("悲しい",["悲しい", "嬉しい", "怒り"]);
// console.log(selecter.候補); // ["悲しい", "嬉しい"]
// console.log(selecter.値); // "悲しい"
// selecter.値 = "嬉しい"; // OK
// selecter.値 = "怒り"; // コンパイルエラー：Type '"怒り"' is not assignable to type 'Emotion'.

console.log(EmotionEnum.悲しい);
let inputObjectBoard = new InputObjectBoard();
document.body.appendChild(inputObjectBoard.component.element);
// let numberInputComponent = new NumberInputComponent("番号",0);