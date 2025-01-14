
import os
from pathlib import Path
from typing import Type
from pydantic import BaseModel

from api.Extend.BaseModel.BaseModel2UIFormatConverter import (
    TypeScriptFormatGenerator,
    ConvertTestModel,
    write_to_ts_file,
)
from api.Extend.ExtendFunc import ExtendFunc

def test_generate_ts_format_for_convert_test_model():
    model: Type[BaseModel] = ConvertTestModel
    generator = TypeScriptFormatGenerator(model)
    ts_content = generator.generate()
    assert "type: \"object\"" in ts_content
    assert "Value" in ts_content
    # ...additional checks...

def test_write_ts_file(tmp_path):
    model: Type[BaseModel] = ConvertTestModel
    generator = TypeScriptFormatGenerator(model)
    ts_content = generator.generate()
    file_path = tmp_path / "ConvertTestModel.ts"
    write_to_ts_file(ts_content, file_path)
    assert file_path.exists()

def manual_run_test():
    model: Type[BaseModel] = ConvertTestModel
    generator = TypeScriptFormatGenerator(model)
    ts_content = generator.generate()
    app_ts_dir = ExtendFunc.api_dir.parent / "app-ts"
    target_dir = app_ts_dir / "src/ZodObject/ConvertTest"
    os.makedirs(target_dir, exist_ok=True)
    output_file_path = target_dir / f"{model.__name__}.ts"
    write_to_ts_file(ts_content, output_file_path)
    print(f"TypeScript format has been written to {output_file_path}")