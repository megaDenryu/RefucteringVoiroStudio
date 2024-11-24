import asyncio
from fastapi import WebSocket
from api.InstanceManager.InsatanceManagerInterface import InstanceManagerInterface
from api.gptAI.AgentManager import AgentEventManager, AgentManager, GPTAgent, GPTBrain, InputReciever, LifeProcessBrain
from api.gptAI.GPTMode import GptModeManager
from api.gptAI.Human import Human
from api.gptAI.HumanInformation import CharacterId


class GPTAgentInstanceManager:
    _instanceManagerInterface:InstanceManagerInterface
    _gpt_agent_dict: dict[CharacterId,GPTAgent] = {}
    _gptModeManager: GptModeManager
    _inputReciever: InputReciever

    @property
    def GPTAgents(self)->list[GPTAgent]:
        return list(self._gpt_agent_dict.values())

    @property
    def inputReciever(self)->InputReciever:
        return self._inputReciever

    def __init__(self, instanceManagerInterface:InstanceManagerInterface) -> None:
        self._instanceManagerInterface = instanceManagerInterface
        self._gptModeManager = instanceManagerInterface.gptModeManager
        self._inputReciever = InputReciever(instanceManagerInterface)

    def createGPTAgent(self, human:Human, webSocket:WebSocket|None)->GPTAgent:
        agenet_event_manager = AgentEventManager(human, self._instanceManagerInterface)
        agenet_manager = AgentManager(human, self._instanceManagerInterface, webSocket)
        gpt_agent = GPTAgent(agenet_manager, agenet_event_manager)
        self._gpt_agent_dict[human.id] = gpt_agent

        return gpt_agent
    
    def createPipeVer2(self,gpt_agent:GPTAgent):
        agenet_event_manager = gpt_agent.event_manager
        agenet_manager = gpt_agent.manager
        pipe = asyncio.gather(
            self.inputReciever.runObserveEpic(),
            agenet_event_manager.setEventQueueArrow(self.inputReciever, agenet_manager.mic_input_check_agent),
            agenet_event_manager.setEventQueueArrow(agenet_manager.mic_input_check_agent, agenet_manager.speaker_distribute_agent),
            agenet_event_manager.setEventQueueArrowWithTimeOutByHandler(agenet_manager.speaker_distribute_agent, agenet_manager.think_agent),
            agenet_event_manager.setEventQueueArrow(agenet_manager.think_agent, agenet_manager.serif_agent),
            # agenet_event_manager.setEventQueueArrow(agenet_manager.think_agent, )
        )
        return pipe
    
    def createPipeVer0(self,gpt_agent:GPTAgent):
        agenet_event_manager = gpt_agent.event_manager
        agenet_manager = gpt_agent.manager
        pipe = asyncio.gather(
            self.inputReciever.runObserveEpic(),
            agenet_event_manager.setEventQueueArrow(self.inputReciever, agenet_manager.mic_input_check_agent),
            agenet_event_manager.setEventQueueArrow(agenet_manager.mic_input_check_agent, agenet_manager.speaker_distribute_agent),
            agenet_event_manager.setEventQueueArrow(agenet_manager.speaker_distribute_agent, agenet_manager.non_thinking_serif_agent),
            # agenet_event_manager.setEventQueueArrowWithTimeOutByHandler(agenet_manager.speaker_distribute_agent, agenet_manager.think_agent),
            # agenet_event_manager.setEventQueueConfluenceArrow([agenet_manager.non_thinking_serif_agent, agenet_manager.think_agent], agenet_manager.serif_agent)
            # agenet_event_manager.setEventQueueArrow(agenet_manager.think_agent, )
        )
        return pipe
    
    def createLifeProcessBrain(self,gpt_agent:GPTAgent)->GPTBrain:
        life_process_brain = LifeProcessBrain(gpt_agent)
        return GPTBrain(gpt_agent,life_process_brain)
    
    def createPipeVer3(self,gptBrain:GPTBrain):
        agenet_event_manager = gptBrain.agent.event_manager
        agenet_manager = gptBrain.agent.manager
        lifeProcessBrain = gptBrain.brain
        # 意思決定のパイプラインを作成
        # 目標の生成とタスクグラフの生成を行いたい。入力を受け取ると、目標を生成し、タスクグラフを生成する。これ以外に目標を生成する方法はあるのか？
        # 入力から目標を生成する過程はどうなっているのか？
        pipe = asyncio.gather(
            self.inputReciever.runObserveEpic(),
            agenet_event_manager.setEventQueueArrow(self.inputReciever, agenet_manager.mic_input_check_agent),
            agenet_event_manager.setEventQueueArrowToCreateTask(self.inputReciever, lifeProcessBrain),
            agenet_event_manager.setEventQueueArrow(agenet_manager.mic_input_check_agent, agenet_manager.speaker_distribute_agent),
            agenet_event_manager.setEventQueueArrow(agenet_manager.speaker_distribute_agent, agenet_manager.non_thinking_serif_agent),
        )
        return pipe