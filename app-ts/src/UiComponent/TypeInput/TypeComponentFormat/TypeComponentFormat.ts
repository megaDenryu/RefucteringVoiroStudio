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

export function checkArrayFormat(format: InputTypeComponentFormat|null): InputTypeArray|null {
    if (format == null) { return null; }
    if (format.type != "array") {
        console.error("フォーマットがarrayではないです。", format);
    }
    return format as InputTypeArray;
}

export interface InputTypeObject extends InputTypeComponentFormat {
    type: "object";
    collection: InputTypeDictionaryCollection;
    format: ObjectFormat;
}

export function checkObjectFormat(format: InputTypeComponentFormat|null): InputTypeObject|null {
    if (format == null) { return null; }
    if (format.type != "object") {
        console.error("フォーマットがobjectではないです。", format);
    }
    return format as InputTypeObject;
}

export interface InputTypeRecord extends InputTypeComponentFormat {
    type: "record";
    collection: InputTypeDictionaryCollection;
    format: RecordFormat;
}

export function checkRecordFormat(format: InputTypeComponentFormat|null): InputTypeRecord|null {
    if (format == null) { return null; }
    if (format.type != "record") { console.error("フォーマットがrecordではないです。", format); }
    return format as InputTypeRecord;
}

export interface InputTypePrimitive extends InputTypeComponentFormat {
    collection: null;
}

export interface InputTypeString extends InputTypePrimitive {
    type: "string";
    collection: null;
    format: StringFormat;
}

export function checkStringFormat(format: InputTypeComponentFormat|null): InputTypeString|null {
    if (format == null) { return null; }
    if (format.type != "string") { console.error("フォーマットがstringではないです。", format); }
    return format as InputTypeString;
}

export interface InputTypeNumber extends InputTypePrimitive {
    type: "number";
    collection: null;
    format: NumberFormat;
}

export function checkNumberFormat(format: InputTypeComponentFormat|null): InputTypeNumber|null {
    if ( format == null ) { return null; }
    if (format.type != "number") { console.error("フォーマットがnumberではないです。", format); }
    return format as InputTypeNumber;
}

export interface InputTypeBoolean extends InputTypePrimitive {
    type: "boolean";
    collection: null;
    format: BooleanFormat;
}

export function checkBooleanFormat(format: InputTypeComponentFormat|null): InputTypeBoolean|null {
    if (format == null ) { return null; }
    if (format.type != "boolean") { console.error("フォーマットがboolではないです。", format); }
    return format as InputTypeBoolean;
}

export interface InputTypeEnum extends InputTypePrimitive {
    type: "enum";
    collection: null;
    format: EnumFormat;
}

export function checkEnumFormat(format: InputTypeComponentFormat|null): InputTypeEnum|null {
    if (format == null) { return null; }
    if (format.type != "enum") { console.error("フォーマットがenumではないです。", format); }
    return format as InputTypeEnum;
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





