import os
from pydantic import BaseModel, Field
from typing import Type

from api.DataStore.AppSetting.AppSettingModel.AppSettingModel import AppSettingsModel

# Zod スキーマを生成する関数
def generate_zod_schema(model: Type[BaseModel]) -> str:
    fields = model.model_fields
    zod_fields = []
    for field_name, field in fields.items():
        field_type = type(field)
        zod_field = f"{field_name}: {field_type.__name__}.default({{}})"
        zod_fields.append(zod_field)
    zod_schema = f"const {model.__name__} = z.object({{\n    " + ",\n    ".join(zod_fields) + "\n}});"
    return zod_schema

# TypeScript ファイルに書き込む関数
def write_to_ts_file(content: str, file_path: str):
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

# メイン処理
if __name__ == "__main__":
    zod_imports = "import { z } from 'zod';\n\n"
    zod_schema = generate_zod_schema(AppSettingsModel)
    ts_content = zod_imports + zod_schema + "\n"
    
    output_file_path = "AppSettingsModel.ts"
    write_to_ts_file(ts_content, output_file_path)
    print(f"Zod schema has been written to {output_file_path}")