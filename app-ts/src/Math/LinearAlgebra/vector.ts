export class VectorN {
    array: number[];

    constructor(array: number[]) {
        this.array = array;
    }

    plus(v: VectorN): VectorN {
        return new VectorN(this.array.map((x, i) => x + v.array[i]));
    }

    minus(v: VectorN): VectorN {
        return new VectorN(this.array.map((x, i) => x - v.array[i]));
    }

    times(k: number): VectorN {
        return new VectorN(this.array.map(x => x * k));
    }

    divide(k: number): VectorN {
        return new VectorN(this.array.map(x => x / k));
    }

    dot(v: VectorN): number {
        return this.array.reduce((sum, x, i) => sum + x * v.array[i], 0);
    }
}

