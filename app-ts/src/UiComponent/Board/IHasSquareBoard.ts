import { SquareBoardComponent } from "./SquareComponent";

export interface IHasSquareBoard {
    get squareBoardComponent(): SquareBoardComponent;
    onAddedToDom(): void;
    optimizeBoardSize(): void
}