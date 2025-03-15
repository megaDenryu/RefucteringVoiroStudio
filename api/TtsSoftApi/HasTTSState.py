
from abc import ABC, abstractmethod
from api.TtsSoftApi.TTSSoftwareInstallState import TTSSoftwareInstallState


class HasTTSState(ABC):
    @property
    @abstractmethod
    def hasTTSSoftware(self)->TTSSoftwareInstallState:
        pass
    
    @property
    @abstractmethod
    def onTTSSoftware(self)->bool:
        pass
    
    @abstractmethod
    def updateAllCharaList(self)->bool:
        pass