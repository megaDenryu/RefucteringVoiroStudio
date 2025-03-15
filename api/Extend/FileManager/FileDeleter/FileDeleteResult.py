from pathlib import Path
from pydantic import BaseModel

class FileDeleteResult(BaseModel):
    file_path: Path
    is_delete_success: bool
    message: str