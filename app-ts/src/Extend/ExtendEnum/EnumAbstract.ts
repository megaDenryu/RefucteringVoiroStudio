export interface EnumAbstract<T extends readonly string[]> {
    readonly candidate: T;
    readonly Type: T[number];
}