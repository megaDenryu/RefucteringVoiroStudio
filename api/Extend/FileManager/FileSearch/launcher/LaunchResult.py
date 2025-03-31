from enum import Enum
from pathlib import Path

from pydantic import BaseModel

class ExecSuccess(Enum):
    SUCCESS = True
    FAILED = False

class LaunchResult(BaseModel):
    file_path: Path|None
    exec_success: ExecSuccess
    message: str