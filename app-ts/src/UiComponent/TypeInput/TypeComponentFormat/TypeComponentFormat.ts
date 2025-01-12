import { TypeComponentType } from "../ComponentType";

export interface InputTypeComponentFormat {
    type: TypeComponentType;
    collection: InputTypeArrayCollection|InputTypeDictionaryCollection|null;
    format: InputTypeFormat;
}

export interface InputTypeArray extends InputTypeComponentFormat {
    collection: InputTypeArrayCollection;
}

export interface InputTypeDictionary extends InputTypeComponentFormat {
    collection: InputTypeDictionaryCollection;
}

export interface InputTypePrimitive extends InputTypeComponentFormat {
    collection: null;
}

export interface InputTypeString extends InputTypePrimitive {
    format: StringFormat;
}

export interface InputTypeNumber extends InputTypePrimitive {
    format: NumberFormat;
}

export interface InputTypeBoolean extends InputTypePrimitive {
    format: BooleanFormat;
}

export interface InputTypeEnum extends InputTypePrimitive {
    format: EnumFormat;
}

export interface InputTypeArray extends InputTypeComponentFormat {
    format: ArrayFormat;
}

export interface InputTypeObject extends InputTypeComponentFormat {
    format: ObjectFormat;
}

export interface InputTypeRecord extends InputTypeComponentFormat {
    format: RecordFormat;
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





