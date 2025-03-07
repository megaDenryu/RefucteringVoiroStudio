from typing import Protocol
from api.TtsSoftApi.TTSSoftwareInstallState import TTSSoftwareInstallState


class HasTTSState(Protocol):
    hasTTSSoftware:TTSSoftwareInstallState
    onTTSSoftware:bool
    def updateAllCharaList(self):
        pass