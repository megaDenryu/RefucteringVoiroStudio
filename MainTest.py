
 

import asyncio
from api.DataStore.FileProxy.DefaultSettingsProxy.LLM.自立型ver1.DefaultシステムメッセージProxy import DefaultシステムメッセージProxy
from api.LLM.エージェント.会話用エージェント.返答判定機.LLM判定テスト import LLM判定テスト
from api.LLM.エージェントテスト.テスト環境.自立型Ver1テスト.思考グラフテスト import 思考グラフテスト


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
    # result = asyncio.run(LaunchUtils.launchExe(ExeFileName("COEIROINKv2.exe")))
    # ExtendFunc.ExtendPrint(result)
    # c = COEIROINKv2SettingModel(path="a")
    # ExtendFunc.ExtendPrint(c)
    # c.path = "b"
    # ExtendFunc.ExtendPrint(c)
    # a = VoiceVoxLauncher.startVoicevox()
    # # a = CoeiroinkLauncher.startCoeiroink()
    # asyncio.run(a)
    
    # a = アプリ起動確認者()
    # a.アプリ起動確認()
    # a.初期化()
    
    # asyncio.run(自立型Ver1test.MainLoop())
    # ConvertTest.main()

    # DefaultシステムメッセージProxy.用途タイプが追加されたので更新()

    
    # asyncio.run(思考グラフテスト.test())
    asyncio.run(思考グラフテスト.test創造的連想モデル())

    







