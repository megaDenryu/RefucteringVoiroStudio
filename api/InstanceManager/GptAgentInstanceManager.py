import asyncio
from typing import Callable
from fastapi import WebSocket
from api.Epic.Epic import Epic
from api.Extend.ExtendFunc import TimeExtend
from api.InstanceManager.HumanDict import HumanInstanceContainer
from api.gptAI.AgentManager import AgentEventManager, AgentManager, GPTAgent
from api.gptAI.GPTMode import GptModeManager
from api.gptAI.Human import Human
from api.gptAI.HumanInformation import CharacterId


class GPTAgentInstanceManager:
    _gpt_agent_dict: dict[CharacterId,GPTAgent] = {}
    _gptModeManager: GptModeManager
    _event:Callable[[TimeExtend], None]
    _EconvertInputRecieverMessageHistoryToTransportedItemData:Callable[[],str]

    @property
    def GPTAgents(self)->list[GPTAgent]:
        return list(self._gpt_agent_dict.values())

    def __init__(self, gptModeManager:GptModeManager, epic:Epic, humanInstances:HumanInstanceContainer):
        self._gptModeManager = gptModeManager
        self._epic = epic
        self._humanInstances = humanInstances

    def createGPTAgent(self, human:Human, webSocket:WebSocket|None)->GPTAgent:
        agenet_event_manager = AgentEventManager(human, self._gptModeManager)
        agenet_event_manager.addEconvertInputRecieverMessageHistoryToTransportedItemData(self._EconvertInputRecieverMessageHistoryToTransportedItemData)
        agenet_manager = AgentManager(human, self._epic, self._humanInstances, webSocket)
        agenet_manager.addClearMessageStackEvent(self._event)
        gpt_agent = GPTAgent(agenet_manager, agenet_event_manager)
        self._gpt_agent_dict[human.id] = gpt_agent

        return gpt_agent
    
    def addClearMessageStackEvent(self, event:Callable[[TimeExtend], None]):
        self._event = event

    def addEconvertInputRecieverMessageHistoryToTransportedItemData(self, func:Callable[[],str]):
        self._EconvertInputRecieverMessageHistoryToTransportedItemData = func
    
    