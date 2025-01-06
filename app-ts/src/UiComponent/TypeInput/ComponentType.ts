
export type TypeComponentType = (
    "string" | "number" | "boolean" | "enum" | "array" | "object" | "record" | "any"
)
export type TypeComponentInterfaceType = (
    "IHasComponent" | "IInputComponet" | "IHasInputComponent" | "IButton" | "IHasSquareBoard" | 
    "IInputComponentCollection" | "ICompositeBase" | "IArrayUnitComponent" | "ICompositeProduct"|
    "IValueComponent"
)

export interface ITypeComponent {
    readonly componentType: TypeComponentType;
    readonly interfaceType: TypeComponentInterfaceType[];
}

export function checknInterfaceType(component: ITypeComponent, type: TypeComponentInterfaceType): boolean {
    return component.interfaceType.includes(type);
}