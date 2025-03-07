from enum import Enum


class TTSSoftwareInstallState(Enum):
    NotInstalled = 0
    Installed = 1
    ModuleNotFound = 2