import { CharaSelectFunctionCreater } from "../UiComponent/CharaInfoSelecter/CharaSelectFunctionCreater";
import "../UiComponent/CharaInfoSelecter/CharaInfoSelecter.css";





console.log("test staart");

async function init() {
    const charaSelectFunctionCreater = new CharaSelectFunctionCreater();
    // await charaSelectFunction.requestCharaInfoTest();
    let charaSelectFunction = await charaSelectFunctionCreater.requestAllCharaInfo();
    charaSelectFunction.component.bindParentElement(document.body);
    console.log("test done");
}

init();