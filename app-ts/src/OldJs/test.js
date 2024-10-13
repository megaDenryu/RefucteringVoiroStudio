
import { CharaSelectFunctionCreater } from "../UiComponent/CharaInfoSelecter/CharaSelectFunctionCreater";





console.log("test staart");

const charaSelectFunction = new CharaSelectFunctionCreater();
await charaSelectFunction.requestCharaInfoTest();
await charaSelectFunction.requestCharaInfo();
console.log("test done");