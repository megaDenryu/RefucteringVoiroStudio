import { TypeComponentType } from "../ComponentType";

export interface InputTypeComponentFormat {
    type: TypeComponentType;
    collectionType: InputTypeArrayCollectionElemnt|InputTypeDictionaryCollection|InputTypeRecordCollectionElement|null;
    format: InputTypeFormat;
}

export interface InputTypeArray<T extends InputTypeArrayCollectionElemnt> extends InputTypeComponentFormat {
    type: "array";
    collectionType: T;
    format: ArrayFormat;
}

export function checkArrayFormat(format: InputTypeComponentFormat|null): InputTypeArray<InputTypeComponentFormat>|null {
    if (format == null) { return null; }
    if (format.type != "array") { console.error("フォーマットがarrayではないです。", format); }
    return format as InputTypeArray<InputTypeComponentFormat>;
}

export interface InputTypeObject extends InputTypeComponentFormat {
    type: "object";
    collectionType: InputTypeDictionaryCollection;
    format: ObjectFormat;
}

export function checkObjectFormat(format: InputTypeComponentFormat|null): InputTypeObject|null {
    if (format == null) { return null; }
    if (format.type != "object") {
        console.error("フォーマットがobjectではないです。", format);
    }
    return format as InputTypeObject;
}

export interface InputTypeRecord<T extends InputTypeRecordCollectionElement> extends InputTypeComponentFormat {
    type: "record";
    collectionType: T;
    format: RecordFormat;
}

export function checkRecordFormat(format: InputTypeComponentFormat|null): InputTypeRecord<InputTypeArrayCollectionElemnt>|null {
    if (format == null) { return null; }
    if (format.type != "record") { console.error("フォーマットがrecordではないです。", format); }
    return format as InputTypeRecord<InputTypeArrayCollectionElemnt>;
}

export function checkStringRecordFormat(format: InputTypeComponentFormat|null): InputTypeRecord<InputTypeString>|null {
    if (format == null) { return null; }
    if (format.type != "record") { console.error("フォーマットがrecordではないです。", format); }
    if (format.collectionType?.type != "string") { console.error("フォーマットがstringではないです。", format); }
    return format as InputTypeRecord<InputTypeString>;
}

export function checkNumberRecordFormat(format: InputTypeComponentFormat|null): InputTypeRecord<InputTypeNumber>|null {
    if (format == null) { return null; }
    if (format.type != "record") { console.error("フォーマットがrecordではないです。", format); }
    if (format.collectionType?.type != "number") { console.error("フォーマットがnumberではないです。", format); }
    return format as InputTypeRecord<InputTypeNumber>;
}

export function checkBooleanRecordFormat(format: InputTypeComponentFormat|null): InputTypeRecord<InputTypeBoolean>|null {
    if (format == null) { return null; }
    if (format.type != "record") { console.error("フォーマットがrecordではないです。", format); }
    if (format.collectionType?.type != "boolean") { console.error("フォーマットがbooleanではないです。", format); }
    return format as InputTypeRecord<InputTypeBoolean>;
}

export function checkEnumRecordFormat(format: InputTypeComponentFormat|null): InputTypeRecord<InputTypeEnum>|null {
    if (format == null) { return null; }
    if (format.type != "record") { console.error("フォーマットがrecordではないです。", format); }
    if (format.collectionType?.type != "enum") { console.error("フォーマットがenumではないです。", format); }
    return format as InputTypeRecord<InputTypeEnum>;
}

export function checkArrayRecordFormat(format: InputTypeComponentFormat|null): InputTypeRecord<InputTypeArrayCollectionElemnt>|null {
    if (format == null) { return null; }
    if (format.type != "record") { console.error("フォーマットがrecordではないです。", format); }
    if (format.collectionType?.type != "array") { console.error("フォーマットがarrayではないです。", format); }
    return format as InputTypeRecord<InputTypeArrayCollectionElemnt>;
}

export function checkObjectRecordFormat(format: InputTypeComponentFormat|null): InputTypeRecord<InputTypeObject>|null {
    if (format == null) { return null; }
    if (format.type != "record") { console.error("フォーマットがrecordではないです。", format); }
    if (format.collectionType?.type != "object") { console.error("フォーマットがobjectではないです。", format); }
    return format as InputTypeRecord<InputTypeObject>;
}

export function checkRecordRecordFormat(format: InputTypeComponentFormat|null): InputTypeRecord<InputTypeRecordCollectionElement>|null {
    if (format == null) { return null; }
    if (format.type != "record") { console.error("フォーマットがrecordではないです。", format); }
    if (format.collectionType?.type != "record") { console.error("フォーマットがrecordではないです。", format); }
    return format as InputTypeRecord<InputTypeRecordCollectionElement>;
}

export interface InputTypePrimitive extends InputTypeComponentFormat {
    collectionType: null;
}

export interface InputTypeString extends InputTypePrimitive {
    type: "string";
    collectionType: null;
    format: StringFormat;
}

export function checkStringFormat(format: InputTypeComponentFormat|null): InputTypeString|null {
    if (format == null) { return null; }
    if (format.type != "string") { console.error("フォーマットがstringではないです。", format); }
    return format as InputTypeString;
}

export interface InputTypeNumber extends InputTypePrimitive {
    type: "number";
    collectionType: null;
    format: NumberFormat;
}

export function checkNumberFormat(format: InputTypeComponentFormat|null): InputTypeNumber|null {
    if ( format == null ) { return null; }
    if (format.type != "number") { console.error("フォーマットがnumberではないです。", format); }
    return format as InputTypeNumber;
}

export interface InputTypeBoolean extends InputTypePrimitive {
    type: "boolean";
    collectionType: null;
    format: BooleanFormat;
}

export function checkBooleanFormat(format: InputTypeComponentFormat|null): InputTypeBoolean|null {
    if (format == null ) { return null; }
    if (format.type != "boolean") { console.error("フォーマットがboolではないです。", format); }
    return format as InputTypeBoolean;
}

export interface InputTypeEnum extends InputTypePrimitive {
    type: "enum";
    collectionType: null;
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

export type InputTypeArrayCollectionElemnt = InputTypeComponentFormat; //配列の要素の型はUnion型は許さないので、配列の要素の型を１個指定すれば良いので、配列形式にする必要はない。

export type InputTypeRecordCollectionElement = InputTypeComponentFormat; //辞書は配列と同じ理由で、辞書の値の型を１個指定すれば良いので、辞書形式にする必要はない。基本的にdict[str,any]のような形式であり、anyの部分にInputTypeComponentFormatを指定する。

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





