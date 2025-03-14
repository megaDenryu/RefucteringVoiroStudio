import { Launcher } from "../AppPage/Launcher/Launcher";
import { TTSLaunchButton } from "../AppPage/Launcher/TTSLaunchButton";
import { SelecterFromEnum } from "../Extend/OriginalEnum";
import { NicoliveClient } from "../NiconamaCommentReciever/version20250227/browser";
import { SquareBoardComponent } from "../UiComponent/Board/SquareComponent";
import { SentenceDisplay } from "../UiComponent/Display/SentenceDisplay/SentenceDisplay";
import { InputObjectBoard } from "../UiComponent/TypeInput/InputObjectBoard";
import { EnumInputComponent } from "../UiComponent/TypeInput/TypeComponents/EnumInputComponent/EnumInputComponent";
import { NumberInputComponent } from "../UiComponent/TypeInput/TypeComponents/NumberInputComponent/NumberInputComponent";


let inputObjectBoard = new InputObjectBoard();
document.body.appendChild(inputObjectBoard.component.element);
inputObjectBoard.onAddedToDom();

let launcher = new Launcher();
document.body.appendChild(launcher.component.element);

let sentenceDisplay = new SentenceDisplay({
    title:"テスト",sentence:"ここに表示したい文書を入力", width:"300px", height:"300px"
});
document.body.appendChild(sentenceDisplay.component.element);

let nico = new NicoliveClient({ liveId: "lv347135367" })
.on("chat", (chat) => {
    console.log(`[${chat.name}] ${chat.content}`);
})
.connect();