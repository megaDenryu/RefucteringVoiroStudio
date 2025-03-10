from api.Extend.ExtendFunc import ExtendFunc
from api.Extend.FileManager.FileSearch.domain.File.exe_file import ExeFileName
from api.Extend.FileManager.FileSearch.util.launch_utils import LaunchUtils
from api.LLM.LLMAPIBase.Google.geminiAPIBase import GeminiAPIUnit
from api.LLM.エージェント.会話用エージェント.返答判定機.LLM判定テスト import LLM判定テスト
import asyncio

from api.LLM.エージェントテスト.テスト環境.GeminiApiテスト.GeminiTest import 連続検索テスト
from api.LLM.エージェントテスト.テスト環境.ルビ振りテスト.GeminiConverterTest import Geminiの連続会話テストユニット
from api.TtsSoftApi.TTSSoftwareManager import TTSSoftwareManager
from api.TtsSoftApi.VoiceVox.VoiceVoxLauncher import VoiceVoxLauncher
from api.gptAI.HumanInformation import DefaultNicknamesManager
 

async def asyncMain():
    await LLM判定テスト()

def main():
    pass


if __name__ == "__main__":
    # Geminiの連続会話テストユニット()
    # unit = GeminiAPIUnit()
    # unit.modelList()
    # 連続検索テスト()
    # a = DefaultNicknamesManager()
    # TTSSoftwareManager.singleton()
    # VoiceVoxLauncher.startVoicevox()
    # result = asyncio.run(LaunchUtils.launchExe(ExeFileName("VOICEVOX.exe")))
    result = asyncio.run(LaunchUtils.launchExe(ExeFileName("COEIROINKv2.exe")))
    ExtendFunc.ExtendPrint(result)

    
        





