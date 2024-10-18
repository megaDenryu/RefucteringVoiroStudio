
import { CharaSelectFunction } from "../UiComponent/CharaInfoSelecter/CharaInfoSelecter";
import { CharaSelectFunctionCreater } from "../UiComponent/CharaInfoSelecter/CharaSelectFunctionCreater";





console.log("test staart");

const charaSelectFunctionCreater = new CharaSelectFunctionCreater();
// await charaSelectFunction.requestCharaInfoTest();
var charaSelectFunction = await charaSelectFunctionCreater.requestAllCharaInfo();
charaSelectFunction.component.bindParentElement(document.body);
console.log("test done");