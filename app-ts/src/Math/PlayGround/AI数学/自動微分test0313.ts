interface IDifferentiable {
    value: number[];
    gradient: number[];
    forward(): void;
    backward(): void;
}

interface IMathFunction {
    forward(x: IDifferentiable): IDifferentiable;
    backward(grad: number[]): number[];
}

class ExpFunction implements IMathFunction {
    forward(x: IDifferentiable): IDifferentiable {
        return {
            value: x.value.map(v => Math.exp(v)),
            gradient: new Array(x.value.length).fill(0),
            forward: () => {},
            backward: () => {
                // expの微分はexp自身
                x.gradient = x.gradient.map((g, i) => g + Math.exp(x.value[i]))
            }
        };
    }

    backward(grad: number[]): number[] {
        return grad;
    }
}

class SumFunction implements IMathFunction {
    forward(x: IDifferentiable): IDifferentiable {
        return {
            value: [x.value.reduce((a, b) => a + b, 0)],
            gradient: new Array(1).fill(0),
            forward: () => {},
            backward: () => {
                // 総和の偏微分は全て1
                x.gradient = x.gradient.map(g => g + 1)
            }
        };
    }

    backward(grad: number[]): number[] {
        return grad;
    }
}


class SoftmaxFunction implements IMathFunction {
    private exp = new ExpFunction();
    private sum = new SumFunction();

    forward(x: IDifferentiable): IDifferentiable {
        const expValues = this.exp.forward(x);
        const sumExp = this.sum.forward(expValues);
        
        return {
            value: x.value.map(v => Math.exp(v) / sumExp.value[0]),
            gradient: new Array(x.value.length).fill(0),
            forward: () => {},
            backward: () => {
                // softmaxの偏微分を計算
                for (let i = 0; i < x.value.length; i++) {
                    for (let j = 0; j < x.value.length; j++) {
                        const softmaxI = Math.exp(x.value[i]) / sumExp.value[0];
                        if (i === j) {
                            x.gradient[i] += softmaxI * (1 - softmaxI);
                        } else {
                            x.gradient[i] += -softmaxI * Math.exp(x.value[j]) / sumExp.value[0];
                        }
                    }
                }
            }
        };
    }

    backward(grad: number[]): number[] {
        return grad;
    }
}