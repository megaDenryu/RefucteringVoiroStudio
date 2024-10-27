export {};

declare global {
    interface Map<K, V> {
        getNthKey(n: number): K;
        getNthValue(n: number): V;
        sort(compareFunction: (a: [K, V], b: [K, V]) => number): void;
        convert2keysArray(): K[];
    }
}

Map.prototype.getNthKey = function<K, V>(this: Map<K, V>, n: number): K {
    let i = 0;
    for (let key of this.keys()) {
        if (i === n) {
            return key;
        }
        i++;
    }
    throw new Error("Index out of range");
};

Map.prototype.getNthValue = function<K, V>(this: Map<K, V>, n: number): V {
    let i = 0;
    for (let value of this.values()) {
        if (i === n) {
            return value;
        }
        i++;
    }
    throw new Error("Index out of range");
};

Map.prototype.sort = function<K, V>(this: Map<K, V>, compareFunction: (a: [K, V], b: [K, V]) => number): void {
    let entries = Array.from(this.entries());
    entries.sort(compareFunction);
    this.clear();
    for (let [key, value] of entries) {
        this.set(key, value);
    }
};

Map.prototype.convert2keysArray = function<K, V>(this: Map<K, V>): K[] {
    let keys = Array.from(this.keys());
    console.log(keys);
    return keys;
};

export class ExtendedMap<T1, T2> extends Map<T1, T2> {
    getNthKey(n: number): T1 {
        let i = 0;
        for (let key of this.keys()) {
            if (i === n) {
                return key;
            }
            i++;
        }
        throw new Error("Index out of bounds");
    }

    getNthValue(n: number): T2 {
        let i = 0;
        for (let value of this.values()) {
            if (i === n) {
                return value;
            }
            i++;
        }
        throw new Error("Index out of bounds");
    }

    sort(compareFn: (a: [T1, T2], b: [T1, T2]) => number): void {
        let entries = Array.from(this.entries());
        entries.sort(compareFn);
        this.clear();
        for (let [key, value] of entries) {
            this.set(key, value);
        }
    }

    comvert2keysArray(): T1[] {
        let keys = Array.from(this.keys());
        console.log(keys);
        return keys;
    }
}