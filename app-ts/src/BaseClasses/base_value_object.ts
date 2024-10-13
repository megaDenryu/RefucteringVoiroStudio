export interface IValueObject<T> {
    equals(other: T): boolean;
    includes(others: T[]): boolean;
}

export class BaseValueObject implements IValueObject<BaseValueObject> {
    [key: string]: any;
    constructor() {}
    equals(other: BaseValueObject): boolean {
        //全てのプロパティが等しいかどうかを判定する
        for (const key in this) {
            if (this[key] !== other[key]) return false;
        }
        return true;
    }

    includes(others: BaseValueObject[]): boolean {
        for (const other of others) {
            if (this.equals(other) === true) return true;
        }
        return false;
    }
}

