import { EnumAbstract } from "./EnumAbstract";
import { EmotionEnum } from "./Exmotion";

// Enumをジェネリクスで扱うクラス
class EnumHandler<E extends EnumAbstract<any>> {
  private enumObj: E;

  constructor(enumObj: E) {
    this.enumObj = enumObj;
  }

  getCandidates(): E["Type"][] {
    return [...this.enumObj.candidate];
  }
}

// 使用例
// const emotionHandler = new EnumHandler(new EmotionEnum());
let a: EmotionEnum["Type"] = "悲しい";
// console.log(emotionHandler.getCandidates()); // ["悲しい", "嬉しい", "怒り"]
