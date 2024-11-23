from api.InstanceManager.InsatanceManagerInterface import InstanceManagerInterface
from api.gptAI.AgentManager import AgentEventManager, AgentManager, GPTAgent
from api.gptAI.GPTMode import GptModeManager
from api.gptAI.Human import Human
from api.gptAI.HumanInformation import CharacterId
from api.gptAI.InputReciever import InputReciever


class GPTAgentInstanceManager:
    _instanceManagerInterface:InstanceManagerInterface
    _gpt_agent_dict: dict[CharacterId,GPTAgent] = {}
    _gptModeManager: GptModeManager
    _inputReciever: InputReciever

    @property
    def GPTAgents(self)->list[GPTAgent]:
        return list(self._gpt_agent_dict.values())

    def __init__(self, instanceManagerInterface:InstanceManagerInterface) -> None:
        self._instanceManagerInterface = instanceManagerInterface
        self._gptModeManager = instanceManagerInterface.gptModeManager
        self._inputReciever = instanceManagerInterface.inputReciever
        pass
    def createGPTAgent(self, human:Human)->GPTAgent:
        agenet_event_manager = AgentEventManager(human, self._instanceManagerInterface)
        agenet_manager = AgentManager(human, self._instanceManagerInterface)
        gpt_agent = GPTAgent(agenet_manager, agenet_event_manager)
        self._gpt_agent_dict[human.id] = gpt_agent

        return gpt_agent