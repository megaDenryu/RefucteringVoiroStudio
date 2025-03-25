from uuid import uuid4
from api import Extend
from api.AppInitializer.AppInitializer import アプリ起動確認者
from api.DataStore.AppSetting.AppSettingModule import AppSettingModule
from api.DataStore.Memo import Memo
# from api.Epic.Epic import Epic
# from api.InstanceManager.GptAgentInstanceManager import GPTAgentInstanceManager
from api.Extend import ExtendFunc
from api.InstanceManager.HumanDict import HumanInstanceContainer
from api.InstanceManager.ClientIds import ClientIds, ClientWebSocket
from api.InstanceManager.InsatanceManagerInterface import InstanceManagerInterface
from api.LLM.エージェント.RubiConverter.AIRubiConverter import AIRubiConverter
from api.LLM.エージェント.RubiConverter.ConverterUnits.ChatGPTRubiConverterUnit import ChatGptRubiConverter
# from api.gptAI.AgentPipeManager import AgentPipeManager
from api.LLM.エージェント.会話用エージェント.自立型Ver1.AISpace import AISpace, AISpaceInitInput
from api.gptAI.GPTMode import GptModeManager
# from api.gptAI.InputReciever import InputReciever


class InastanceManager(InstanceManagerInterface):
    _instance: "InastanceManager|None" = None
    _initialized: bool = False
    _appStartChecker: アプリ起動確認者
    _clientIds: ClientIds
    _clientWs: ClientWebSocket
    _humanInstances: HumanInstanceContainer
    _gptModeManager: GptModeManager
    # _epic: Epic
    # _gptAgentInstanceManager: GPTAgentInstanceManager
    # _inputReciever: InputReciever
    # _agentPipeManager: AgentPipeManager
    _appSettingModule :AppSettingModule
    _diary:Memo
    _aiSpace:AISpace

    @property
    def appStartChecker(self):
        return self._appStartChecker

    @property
    def clientIds(self):
        return self._clientIds
    
    @property
    def clientWs(self):
        return self._clientWs
    
    @property
    def humanInstances(self)->HumanInstanceContainer:
        return self._humanInstances
    
    @property
    def gptModeManager(self):
        return self._gptModeManager
    
    # @property
    # def epic(self):
    #     return self._epic
    
    # @property
    # def gptAgentInstanceManager(self):
    #     return self._gptAgentInstanceManager
    
    # @property
    # def inputReciever(self):
    #     return self._inputReciever
    
    # @property
    # def agentPipeManager(self):
    #     return self._agentPipeManager
    
    @property
    def aiRubiConverterList(self)->list[AIRubiConverter]:
        retList:list[AIRubiConverter] = []
        for human in self._humanInstances.Humans:
            retList.append(human.aiRubiConverter)
        return retList
    
    @property
    def appSettingModule(self):
        return self._appSettingModule
    
    @property
    def diary(self):
        return self._diary
    
    @property
    def aiSpace(self):
        return self._aiSpace

    

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            instance = super().__new__(cls)
            cls._instance = instance
        return cls._instance

    def __init__(self):
        # __init__ は new されたたびに呼ばれるので、一度だけ初期化する
        if hasattr(self, "_initialized") and self._initialized:
            return
        self._initialized = True
        self._instance = self
        self._appStartChecker = アプリ起動確認者()
        self._clientIds = ClientIds()
        self._clientWs = ClientWebSocket()
        aISpaceInitInput:AISpaceInitInput = {"id":str(uuid4())}
        self._aiSpace = AISpace(aISpaceInitInput)
        self._humanInstances = HumanInstanceContainer(self.aiSpace)
        self._gptModeManager = GptModeManager()
        # self._epic = Epic()
        # self._gptAgentInstanceManager = GPTAgentInstanceManager(self._gptModeManager, self._epic, self._humanInstances)
        # self._inputReciever = InputReciever(self._epic, self._gptAgentInstanceManager)
        # self._agentPipeManager = AgentPipeManager(self._inputReciever)
        self._appSettingModule = AppSettingModule()
        self._diary = Memo()
        self.registerEvent()

    @staticmethod
    def singleton():
        return InastanceManager()

    def registerEvent(self):
        # self._gptAgentInstanceManager.addClearMessageStackEvent(self._inputReciever.clearMessageStack)
        # self._gptAgentInstanceManager.addEconvertInputRecieverMessageHistoryToTransportedItemData(self._inputReciever.convertInputRecieverMessageHistoryToTransportedItemData)
        pass