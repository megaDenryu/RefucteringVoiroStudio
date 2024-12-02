import asyncio
from api.gptAI.AgentManager import GPTAgent, GPTBrain, LifeProcessBrain
from api.gptAI.InputReciever import InputReciever


class AgentPipeManager:
    inputReciever:InputReciever
    def __init__(self, inputReciever:InputReciever, ):
        self._inputReciever = inputReciever

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