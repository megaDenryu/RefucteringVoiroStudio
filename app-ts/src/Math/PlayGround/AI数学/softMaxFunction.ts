
interface I値 {
    演算(値:I値):I値;
}

class Vector implements I値{
    value:number[];
    constructor(v:number[]){
        this.value = v;
    }
    演算(v:Vector):Vector{
        let result = new Vector([]);
        for(let i = 0; i < this.value.length; i++){
            result.value.push(this.value[i] + v.value[i]);
        }
        return result;
    }
}


interface Iパラメーター付き値関数 {
    input(v:I値):I値;
    _(v:I値):I値; // input関数を定義する
}

class Cパラメーター付き値関数 {
    private parameter:I値;
    constructor(p:I値){
        this.parameter = p;
    }

    public input(v:I値):I値{
        return this.parameter.演算(v);
    }
}

class Cソフトマックス関数ベクトル値ver implements Iパラメーター付き値関数 {
    parameter:Vector;
    constructor(p:Vector){
        this.parameter = p;
    }

    public _(v:Vector):Vector{return this.input(v);}

    public input(v:Vector):Vector{
        let 分母 = 0;
        for(let i = 0; i < v.value.length; i++){
            分母 += Math.exp(v.value[i]);
        }
        let result = new Vector([]);
        for(let i = 0; i < v.value.length; i++){
            result.value.push(Math.exp(v.value[i]) / 分母);
        }
        return result;
    }
}

class Cソフトマックス関数行列値ver implements Iパラメーター付き値関数 {
    softMaxArray:Cソフトマックス関数ベクトル値ver[];
    constructor(parameter:Vector[]){
        this.softMaxArray = [];
        for(let i = 0; i < parameter.length; i++){
            this.softMaxArray.push(new Cソフトマックス関数ベクトル値ver(parameter[i]));
        }
    }

    public _(v:Vector):Vector{return this.input(v);}

    public input(v:Vector):Vector{
        let result = new Vector([]);
        for(let i = 0; i < this.softMaxArray.length; i++){
            result.value.push(this.softMaxArray[i].input(v).value[0]);
        }
        return result;
    }
}