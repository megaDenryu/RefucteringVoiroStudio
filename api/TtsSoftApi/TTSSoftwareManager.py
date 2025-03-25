import asyncio
from api.Extend.ExtendFunc import ExtendFunc
from api.TtsSoftApi.AIVoice.AIVoiceHuman import AIVoiceHuman
from api.TtsSoftApi.CevioAI.CevioAIHuman import CevioAIHuman
from api.TtsSoftApi.Coeiroink.CoeiroinkLauncher import CoeiroinkLauncher
from api.TtsSoftApi.HasTTSState import HasTTSState
from api.TtsSoftApi.TTSSoftwareInstallState import TTSSoftwareInstallState
from api.TtsSoftApi.VoiceVox.VoiceVoxLauncher import VoiceVoxLauncher
from api.gptAI.HumanInfoValueObject import TTSSoftware


class TTSSoftwareManager:
    _instance:"TTSSoftwareManager"
    onTTSSoftwareDict:dict[TTSSoftware,bool] = {
        TTSSoftware.AIVoice:False,
        TTSSoftware.CevioAI:False,
        TTSSoftware.VoiceVox:False,
        TTSSoftware.Coeiroink:False
    }

    hasTTSSoftwareDict:dict[TTSSoftware,TTSSoftwareInstallState] = {
        TTSSoftware.AIVoice:TTSSoftwareInstallState.NotInstalled,
        TTSSoftware.CevioAI:TTSSoftwareInstallState.NotInstalled,
        TTSSoftware.VoiceVox:TTSSoftwareInstallState.NotInstalled,
        TTSSoftware.Coeiroink:TTSSoftwareInstallState.NotInstalled
    }

    HasTTSStateDict:dict[TTSSoftware,HasTTSState|None] = {
        TTSSoftware.AIVoice:None,
        TTSSoftware.CevioAI:None,
        TTSSoftware.VoiceVox:None,
        TTSSoftware.Coeiroink:None
    }

    """
    各種ボイスロイドの起動を管理する
    """
    def __init__(self):
        pass

    @staticmethod
    def singleton():
        if not hasattr(TTSSoftwareManager, "_instance"):
            TTSSoftwareManager._instance = TTSSoftwareManager()
        return TTSSoftwareManager._instance

    @staticmethod
    def tryStartAllTTSSoftware():
        """
        全てのボイスロイドを起動する
        """
        for ttss in TTSSoftware:
            TTSSate = asyncio.run(TTSSoftwareManager.tryStartTTSSoftware(ttss))
            TTSSoftwareManager.HasTTSStateDict[ttss] = TTSSate

    @staticmethod
    async def tryStartTTSSoftware(ttss:TTSSoftware)->HasTTSState:
        """
        各種ボイスロイドを起動する
        """
        
        if ttss == TTSSoftware.AIVoice:
            tmp_human = AIVoiceHuman(None,0)
        elif ttss == TTSSoftware.CevioAI:
            tmp_human = CevioAIHuman(None,0)
        elif ttss == TTSSoftware.VoiceVox:
            tmp_human = await VoiceVoxLauncher.startVoicevox()
        elif ttss == TTSSoftware.Coeiroink:
            tmp_human = await CoeiroinkLauncher.startCoeiroink()
        
        mana = TTSSoftwareManager.singleton()
        mana.onTTSSoftwareDict[ttss] = tmp_human._onTTSSoftware
        mana.hasTTSSoftwareDict[ttss] = tmp_human._hasTTSSoftware
        return tmp_human
    
    @staticmethod
    async def updateAllCharaList():
        """
        ボイロの起動コマンド直後にやると、声色インクとかが、非同期ではなく別プロセスで実行されてるせいで失敗することがあるのでアプデボタンを押したときに実行するようにする。また、通信に失敗した場合はエラーを投げる。
        """
        for ttss in TTSSoftware:
            state = TTSSoftwareManager.HasTTSStateDict[ttss]
            if state is not None:
                await TTSSoftwareManager.updateCharaList(ttss,state)
    
    @staticmethod
    async def tryUpdateCharaList(ttss:TTSSoftware):
        """
        ボイロの起動コマンド直後にやると、声色インクとかが、非同期ではなく別プロセスで実行されてるせいで失敗することがあるのでアプデボタンを押したときに実行するようにする。また、通信に失敗した場合はエラーを投げる。
        """
        state = TTSSoftwareManager.HasTTSStateDict[ttss]
        if state is not None:
            await TTSSoftwareManager.updateCharaList(ttss,state)

    @staticmethod
    async def updateCharaList(ttss:TTSSoftware, human_state:HasTTSState)->bool:
        """
        各種ボイスロイドのキャラクターリストを更新する.
        todo : ボイロが起動するまで待つ。
        """
        if human_state.hasTTSSoftware == TTSSoftwareInstallState.Installed and human_state.onTTSSoftware:
            ExtendFunc.ExtendPrintWithTitle(f"{ttss}のキャラクターリストを更新します。")
            MAX_RETRIES = 10
            RETRY_INTERVAL = 3  # 秒
            
            for attempt in range(MAX_RETRIES):
                result = human_state.updateAllCharaList()
                if result:
                    return True
                    
                if attempt < MAX_RETRIES - 1:  # 最後の試行でなければ待機
                    ExtendFunc.ExtendPrintWithTitle(f"{ttss}のキャラクターリスト更新を再試行します。(試行回数: {attempt + 1})")
                    await asyncio.sleep(RETRY_INTERVAL)
            
            ExtendFunc.ExtendPrintWithTitle(f"{ttss}のキャラクターリスト更新が{MAX_RETRIES}回失敗しました。")
            return False





        else:
            onTTSSoftwareDict = TTSSoftwareManager._instance.onTTSSoftwareDict[ttss]
            ExtendFunc.ExtendPrintWithTitle(f"{ttss}の起動状況",onTTSSoftwareDict)
            ExtendFunc.ExtendPrintWithTitle(f"{ttss}のキャラクターリストの更新に失敗しました。",human_state)
            return False