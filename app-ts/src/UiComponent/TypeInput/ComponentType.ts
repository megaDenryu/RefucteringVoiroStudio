
export type TypeComponentType = (
    "string" | "number" | "boolean" | "enum" | "array" | "object" | "Record" | "any"
)
export type TypeComponentInterfaceType = (
    "IHasComponent" | "IInputComponet" | "IHasInputComponent" | "IButton" | "IHasSquareBoard" | 
    "IInputComponentCollection" | "ICompositeBase" | "IArrayUnitComponent" | "ICompositeProduct"
)

export interface ITypeComponent {
    readonly componentType: TypeComponentType;
    readonly interfaceType: TypeComponentInterfaceType[];
}