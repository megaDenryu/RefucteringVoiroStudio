import { CharaSelectFunctionCreater } from "../UiComponent/CharaInfoSelecter/CharaSelectFunctionCreater";
import "../UiComponent/CharaInfoSelecter/CharaInfoSelecter.css";





console.log("test staart");

const charaSelectFunctionCreater = new CharaSelectFunctionCreater();
// await charaSelectFunction.requestCharaInfoTest();
var charaSelectFunction = await charaSelectFunctionCreater.requestAllCharaInfo();
charaSelectFunction.component.bindParentElement(document.body);
console.log("test done");