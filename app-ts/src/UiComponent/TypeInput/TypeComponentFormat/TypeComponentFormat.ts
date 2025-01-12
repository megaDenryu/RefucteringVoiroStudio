export interface InputTypeObject {
    type: string;
    collection: InputTypeObjectArray|InputTypeObjectDictionary|null;
    format: InputTypeFormat;
}

// キーが string で値が InputTypeObject の辞書型を定義
export type InputTypeObjectDictionary = {
    [key: string]: InputTypeObject;
};

export type InputTypeObjectArray = InputTypeObject[];

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





