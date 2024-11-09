export interface IValueObject<T> {
    equals(other: T): boolean;
    hashCode(): string;
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

    hashCode(): string {
        //全てのプロパティを文字列にして連結したものを返す
        let hash = "";
        for (const key in this) {
            hash += this[key].toString();
        }
        return hash;
    }

    includes(others: BaseValueObject[]): boolean {
        for (const other of others) {
            if (this.equals(other) === true) return true;
        }
        return false;
    }
}

