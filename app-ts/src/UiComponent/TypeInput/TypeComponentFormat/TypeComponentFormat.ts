import { TypeComponentType } from "../ComponentType";

export interface InputTypeComponentFormat {
    type: TypeComponentType;
    collection: InputTypeArrayCollection|InputTypeDictionaryCollection|null;
    format: InputTypeFormat;
}

export interface InputTypeArray extends InputTypeComponentFormat {
    type: "array";
    collection: InputTypeArrayCollection;
    format: ArrayFormat;
}

export interface InputTypeObject extends InputTypeComponentFormat {
    type: "object";
    collection: InputTypeDictionaryCollection;
    format: ObjectFormat;
}

export interface InputTypeRecord extends InputTypeComponentFormat {
    type: "record";
    collection: InputTypeDictionaryCollection;
    format: RecordFormat;
}

export interface InputTypePrimitive extends InputTypeComponentFormat {
    collection: null;
}

export interface InputTypeString extends InputTypePrimitive {
    type: "string";
    collection: null;
    format: StringFormat;
}

export interface InputTypeNumber extends InputTypePrimitive {
    type: "number";
    collection: null;
    format: NumberFormat;
}

export interface InputTypeBoolean extends InputTypePrimitive {
    type: "boolean";
    collection: null;
    format: BooleanFormat;
}

export interface InputTypeEnum extends InputTypePrimitive {
    type: "enum";
    collection: null;
    format: EnumFormat;
}



// キーが string で値が InputTypeObject の辞書型を定義
export type InputTypeDictionaryCollection = {
    [key: string]: InputTypeComponentFormat;
}

export type InputTypeArrayCollection = InputTypeComponentFormat[];

export interface InputTypeFormat {
    visualType: string;
}

export interface StringFormat extends InputTypeFormat {

}

export interface NumberFormat extends InputTypeFormat {
    step: number;
}

export interface BooleanFormat extends InputTypeFormat {
    
}

export interface EnumFormat extends InputTypeFormat {

}

export interface ArrayFormat extends InputTypeFormat {

}

export interface ObjectFormat extends InputTypeFormat {

}

export interface RecordFormat extends InputTypeFormat {

}





