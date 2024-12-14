import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { JsonSchemaToZodConverter } from "./src/ZodTest/schemaToZodConverter"

/// <reference types="node" />

// CLI引数を設定
const argv = yargs(hideBin(process.argv))
    .option('modelName', {
        alias: 'm',
        type: 'string',
        description: 'Model name',
        demandOption: true
    })
    .option('jsonSchemaPath', {
        alias: 'j',
        type: 'string',
        description: 'Path to the JSON schema file',
        demandOption: true
    })
    .option('zodTsPath', {
        alias: 'z',
        type: 'string',
        description: 'Path to save the generated Zod schema',
        demandOption: true
    })
    .argv;

// CLI引数から変数を取得
const { modelName, jsonSchemaPath, zodTsPath } = argv;
console.log(`modelName: ${modelName}`, `jsonSchemaPath: ${jsonSchemaPath}`, `zodTsPath: ${zodTsPath}`);
// let a = new JsonSchemaToZodConverter(modelName, jsonSchemaPath, zodTsPath);