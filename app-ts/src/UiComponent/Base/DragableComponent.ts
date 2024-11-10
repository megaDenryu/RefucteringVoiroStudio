import { BaseComponent, IHasComponent } from "./ui_component_base";

export interface IDragAble {
    component: BaseComponent;
    dragMover: DragMover;
}

export class DragMover {
    private _iHasComponent: IHasComponent;
    private _dragging: boolean = false;
    private _startX: number;
    private _startY: number;
    private _offsetX: number;
    private _offsetY: number;

    constructor(iHasComponent: IHasComponent) {
        this._iHasComponent = iHasComponent;
        this._iHasComponent.component.element.addEventListener('mousedown', this.onMouseDown.bind(this));
        this._iHasComponent.component.element.addEventListener('dragstart', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    private onMouseDown(e: MouseEvent) {
        this._dragging = true;
        this._startX = e.clientX;
        this._startY = e.clientY;
        this._offsetX = this._iHasComponent.component.element.offsetLeft;
        this._offsetY = this._iHasComponent.component.element.offsetTop;
    }

    private onMouseMove(e: MouseEvent) {
        if (this._dragging) {
            const deltaX = e.clientX - this._startX;
            const deltaY = e.clientY - this._startY;
            this._iHasComponent.component.element.style.left = (this._offsetX + deltaX) + 'px';
            this._iHasComponent.component.element.style.top = (this._offsetY + deltaY) + 'px';
        }
    }

    private onMouseUp() {
        this._dragging = false;
    }

    private onDragStart(e: DragEvent) {
        e.preventDefault();
    }
}