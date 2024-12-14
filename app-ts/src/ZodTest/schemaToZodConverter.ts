import { Schema, z } from 'zod';
import fs from 'fs-extra';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import convertSchema from 'json-schema-to-zod'



export class JsonSchemaToZodConverter {
    constructor () {
        this.loadSchema("C:\\Users\\pokr301qup\\python_dev\\VoiroStudio\\RefucteringVoiroStudio\\app-ts\\src\\ZodObject\\DataStore\\AppSetting\\AppSettingModel\\AppSettingModel.json")
    }

    loadSchema (schemaPath: string): void {
        const schema:string = fs.readJsonSync(schemaPath);
        const zodSchema = this.convertSchema(schema);
        console.log(zodSchema);
    }

    convertSchema(schema: any): string {
        return convertSchema(schema);
    }
}

