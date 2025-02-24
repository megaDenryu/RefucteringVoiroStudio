import { Launcher } from "../../AppPage/Launcher/Launcher";
import { TTSLaunchButton } from "../../AppPage/Launcher/TTSLaunchButton";
import { SelecterFromEnum } from "../../Extend/OriginalEnum";
import { SquareBoardComponent } from "../Board/SquareComponent";
import { SentenceDisplay } from "../Display/SentenceDisplay/SentenceDisplay";
import { InputObjectBoard } from "./InputObjectBoard";
import { EnumInputComponent } from "./TypeComponents/EnumInputComponent/EnumInputComponent";
import { NumberInputComponent } from "./TypeComponents/NumberInputComponent/NumberInputComponent";


// let inputObjectBoard = new InputObjectBoard();
// document.body.appendChild(inputObjectBoard.component.element);
// inputObjectBoard.onAddedToDom();

let launcher = new Launcher();
document.body.appendChild(launcher.component.element);

let sentenceDisplay = new SentenceDisplay({
    title:"テスト",sentence:"ここに表示したい文書を入力", width:"300px", height:"300px"
});
document.body.appendChild(sentenceDisplay.component.element);