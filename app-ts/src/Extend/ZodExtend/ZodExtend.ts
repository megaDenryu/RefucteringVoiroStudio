import { z, ZodTypeAny, ZodObject, ZodOptional, ZodDefault, ZodString, ZodNumber, ZodBoolean, ZodArray, ZodEnum } from "zod";

// 再帰的にデフォルトオブジェクトを生成する関数
export function generateDefaultObject(schema: ZodTypeAny): any {
  if (schema instanceof ZodObject) {
    const result: any = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      result[key] = generateDefaultObject(fieldSchema);
    }
    return result;
  } else if (schema instanceof ZodOptional) {
    return generateDefaultObject(schema._def.innerType);
  } else if (schema instanceof ZodDefault) {
    return schema._def.defaultValue();
  } else if (schema instanceof ZodString) {
    return schema.isOptional() ? "" : "";
  } else if (schema instanceof ZodNumber) {
    return schema.isOptional() ? 0 : 0;
  } else if (schema instanceof ZodBoolean) {
    return schema.isOptional() ? false : false;
  } else if (schema instanceof ZodArray) {
    return [];
  } else if (schema instanceof ZodEnum) {
    return schema._def.values[0];
  } else {
    throw new Error(`Default value not defined for schema: ${schema}`);
  }
}


// 再帰的にデフォルトオブジェクトを生成する関数
export function generateDefaultObjectStrict(schema: ZodTypeAny): any {
    if (schema instanceof ZodObject) {
      const result: any = {};
      for (const key in schema.shape) {
        const fieldSchema = schema.shape[key];
        result[key] = generateDefaultObject(fieldSchema);
      }
      return result;
    } else if (schema instanceof ZodOptional) {
      return generateDefaultObject(schema._def.innerType);
    } else if (schema instanceof ZodDefault) {
      return schema._def.defaultValue();
    } else if (schema instanceof ZodString) {
      return schema.isOptional() ? "" : (() => {throw new Error(`Default value not defined for required string schema: ${schema}`)});
    } else if (schema instanceof ZodNumber) {
      return schema.isOptional() ? 0 : (() => {throw new Error(`Default value not defined for required number schema: ${schema}`)});
    } else if (schema instanceof ZodBoolean) {
      return schema.isOptional() ? false : (() => {throw new Error(`Default value not defined for required boolean schema: ${schema}`)});
    } else if (schema instanceof ZodArray) {
      return [];
    } else if (schema instanceof ZodEnum) {
      return schema._def.values[0];
    } else {
      throw new Error(`Default value not defined for schema: ${schema}`);
    }
  }