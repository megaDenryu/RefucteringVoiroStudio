from pathlib import Path
from dataclasses import dataclass

@dataclass
class FileCreateResult:
    file_path: Path
    is_create_success: bool
    message: str