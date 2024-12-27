export class EventDelegator<T = void> {
    private _methods: Record<string, (value: T) => void> = {};

    constructor() {}

    public addMethod(event: (value: T) => void, key: string): void {
        if (this._methods[key]) {
            console.error(`Key already exists: ${key}`);
            return;
        }
        this._methods[key] = event;
    }

    public invoke(value: T, key: string | null = null): void {
        if (key === null) {
            for (let key in this._methods) {
                this._methods[key](value);
            }
        } else {
            const method = this._methods[key];
            if (method) {
                method(value);
            } else {
                console.error(`Method not found for key: ${key}`);
            }
        }
    }

    public invokeByQueue(value: T, keys: string[]): void {
        for (let key of keys) {
            const method = this._methods[key];
            if (method) {
                method(value);
            } else {
                console.error(`Method not found for key: ${key}`);
            }
        }
    }

    public removeMethod(key: string): void {
        delete this._methods[key];
    }

    public clearMethods(): void {
        this._methods = {};
    }
}

export class ActionDelegator<T = void, R = void> {
    private _method: ((value: T) => R) | null = null;

    constructor() {}

    public setMethod(event: (value: T) => R): void {
        this._method = event;
    }

    public invoke(value: T): R | void {
        if (this._method) {
            return this._method(value);
        } else {
            console.error(`Method not set`);
        }
    }

    public clearMethod(): void {
        this._method = null;
    }
}