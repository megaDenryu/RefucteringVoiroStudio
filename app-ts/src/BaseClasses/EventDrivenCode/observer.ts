export class ReactiveProperty<T> {
    private _property: T;

    constructor(value: T) {
        this._property = value;
    }

    private get property(): T {
        return this._property;
    }

    private set property(value: T) {
        this._property = value;
    }

    private methods: Array<(value: T) => void> = [];

    private executeMethods(value: T): void {
        for (let i = 0; i < this.methods.length; i++) {
            this.methods[i](value);
        }
    }

    public get(): T {
        return this._property;
    }

    public set(value: T): void {
        this.property = value;
        this.executeMethods(value);
    }

    public setWithoutEvent(value: T): void {
        this._property = value;
    }

    public addMethod(event: (value :T) => void): void {
        this.methods.push(event);
    }

    public clearMethods(): void {
        this.methods = [];
    }
}