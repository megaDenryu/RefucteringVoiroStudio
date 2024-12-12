import { SelecterFromEnum } from "../../Extend/OriginalEnum";
import { SquareBoardComponent } from "../Board/SquareComponent";
import { InputObjectBoard } from "./InputObjectBoard";
import { EnumInputComponent } from "./TypeComponents/EnumInputComponent/EnumInputComponent";
import { NumberInputComponent } from "./TypeComponents/NumberInputComponent/NumberInputComponent";


let inputObjectBoard = new InputObjectBoard();
document.body.appendChild(inputObjectBoard.component.element);
inputObjectBoard.onAddedToDom();
// let numberInputComponent = new NumberInputComponent("番号",0);