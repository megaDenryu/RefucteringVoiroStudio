import { z } from 'zod';
import fs from 'fs-extra';
import path from 'path';
import { resolveRefs } from 'json-refs';
import { format } from 'prettier';
import convertSchema from 'json-schema-to-zod';

export class JsonSchemaToZodConverter {
    private jsonSchemaPath: string;
    private zodTsPath: string;
    private zodSchema: string;
    private modelName: string;

    constructor(modeName: string, jsonSchemaPath: string, zodTsPath: string) {
        this.modelName = modeName;
        this.jsonSchemaPath = jsonSchemaPath//"C:\\Users\\pokr301qup\\python_dev\\VoiroStudio\\RefucteringVoiroStudio\\app-ts\\src\\ZodObject\\DataStore\\AppSetting\\AppSettingModel\\AppSettingModel.json";
        this.zodTsPath = zodTsPath//"C:\\Users\\pokr301qup\\python_dev\\VoiroStudio\\RefucteringVoiroStudio\\app-ts\\src\\ZodObject\\DataStore\\AppSetting\\AppSettingModel\\AppSettingModel.ts";
        this.loadSchema(this.jsonSchemaPath);
    }

    async loadSchema(schemaPath: string): Promise<void> {
        const schema = fs.readJsonSync(schemaPath);
        const { resolved } = await resolveRefs(schema);
        console.log(resolved);
        const zodSchema = this.convertSchema(resolved);
        const formatted = await format(this.createZodDefineTsCode(zodSchema,this.modelName), { parser: "typescript" });
        this.zodSchema = formatted;
        console.log(formatted);
        this.generateTsFile();
    }

    convertSchema(schema: any): string {
        return convertSchema(schema);
    }

    generateTsFile(): void {
        fs.writeFileSync(this.zodTsPath, this.zodSchema);
        console.log(`Zod schema written to ${this.zodTsPath}`);
    }

    createZodDefineTsCode(zodSchema: string, modelName:string): string {
        return `
        import { z } from 'zod';
        export const ${modelName} = ${zodSchema};
        export type ${modelName}Type = z.infer<typeof ${modelName}>;
    `;
    }
}