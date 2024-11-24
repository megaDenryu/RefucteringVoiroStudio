from api.Epic.Epic import Epic
from api.InstanceManager.GptAgentInstanceManager import GPTAgentInstanceManager
from api.InstanceManager.HumanDict import HumanInstanceContainer
from api.InstanceManager.ClientIds import ClientIds, ClientWebSocket
from api.InstanceManager.InsatanceManagerInterface import InstanceManagerInterface
from api.gptAI.GPTMode import GptModeManager


class InastanceManager(InstanceManagerInterface):
    _clientIds: ClientIds
    _clientWs: ClientWebSocket
    _humanInstances: HumanInstanceContainer
    _gptModeManager: GptModeManager
    _epic: Epic
    _gptAgentInstanceManager: GPTAgentInstanceManager

    @property
    def clientIds(self):
        return self._clientIds
    
    @property
    def clientWs(self):
        return self._clientWs
    
    @property
    def humanInstances(self):
        return self._humanInstances
    
    @property
    def gptModeManager(self):
        return self._gptModeManager
    
    @property
    def epic(self):
        return self._epic
    
    @property
    def gptAgentInstanceManager(self):
        return self._gptAgentInstanceManager
    

    def __init__(self):
        self._clientIds = ClientIds()
        self._clientWs = ClientWebSocket()
        self._humanInstances = HumanInstanceContainer()
        self._gptModeManager = GptModeManager()
        self._epic = Epic()
        self._gptAgentInstanceManager = GPTAgentInstanceManager(self)


    