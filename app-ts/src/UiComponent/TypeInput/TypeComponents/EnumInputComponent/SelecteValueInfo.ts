

export class SelecteValueInfo {
    private readonly _candidate: string[];
    private _value: string;
    constructor(candidate: string[], value: string) {
        this._candidate = candidate;
        this._value = value;
    }
    get candidate() { return this._candidate; }
    get value() { return this._value; }
    set value(value: string) { 
        if (this._candidate.indexOf(value) === -1) {
            throw new Error(`値が候補に含まれていません。値:${value} 候補:${this._candidate}`);
        }
        this._value = value; 
    }
} 