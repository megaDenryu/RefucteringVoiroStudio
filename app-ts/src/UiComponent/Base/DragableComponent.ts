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
    private _lastX: number;
    private _lastY: number;

    constructor(iHasComponent: IHasComponent) {
        this._iHasComponent = iHasComponent;
        this._iHasComponent.component.element.addEventListener('mousedown', this.onMouseDown.bind(this));
        this._iHasComponent.component.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this._iHasComponent.component.element.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    private onMouseDown(e: MouseEvent) {
        this._dragging = true;
        this._startX = e.clientX;
        this._startY = e.clientY;
        this._offsetX = this._iHasComponent.component.element.offsetLeft;
        this._offsetY = this._iHasComponent.component.element.offsetTop;
        this._lastX = this._startX;
        this._lastY = this._startY;
    }

    private onMouseMove(e: MouseEvent) {
        if (this._dragging) {
            let deltaX = e.clientX - this._lastX;
            let deltaY = e.clientY - this._lastY;
            this._iHasComponent.component.element.style.left = (this._offsetX + deltaX) + 'px';
            this._iHasComponent.component.element.style.top = (this._offsetY + deltaY) + 'px';
            this._lastX = e.clientX;
            this._lastY = e.clientY;
        }
    }

    private onMouseUp() {
        this._dragging = false;
    }

}