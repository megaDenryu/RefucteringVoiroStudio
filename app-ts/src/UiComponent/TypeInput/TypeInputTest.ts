import { SquareBoardComponent } from "../Board/SquareComponent";
import { InputObjectBoard } from "./InputObjectBoard";
import { NumberInputComponent } from "./TypeComponents/NumberInputComponent/NumberInputComponent";

// let 板 = new SquareBoardComponent(1000,1000);
// document.body.appendChild(板.component.element);
let inputObjectBoard = new InputObjectBoard();
document.body.appendChild(inputObjectBoard.component.element);
// let numberInputComponent = new NumberInputComponent("番号",0);