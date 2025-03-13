from abc import ABC, abstractmethod

# from api.Epic.Epic import Epic
from api.InstanceManager.ClientIds import ClientIds, ClientWebSocket
# from api.InstanceManager.GptAgentInstanceManager import GPTAgentInstanceManager
from api.InstanceManager.HumanDict import HumanInstanceContainer
# from api.gptAI.AgentPipeManager import AgentPipeManager
from api.gptAI.GPTMode import GptModeManager
# from api.gptAI.InputReciever import InputReciever
# from api.gptAI.InputReciever import InputReciever

class InstanceManagerInterface(ABC):    
    @property
    @abstractmethod
    def clientIds(self)->ClientIds:
        pass
    
    @property
    @abstractmethod
    def clientWs(self)->ClientWebSocket:
        pass
    
    @property
    @abstractmethod
    def humanInstances(self)->HumanInstanceContainer:
        pass
    
    @property
    @abstractmethod
    def gptModeManager(self)->GptModeManager:
        pass
    
    # @property
    # @abstractmethod
    # def epic(self)->Epic:
    #     pass
    
    # @property
    # @abstractmethod
    # def gptAgentInstanceManager(self)->"GPTAgentInstanceManager":
    #     pass

    # @property
    # @abstractmethod
    # def inputReciever(self)->InputReciever:
    #     pass

    # @property
    # @abstractmethod
    # def agentPipeManager(self)->AgentPipeManager:
    #     pass