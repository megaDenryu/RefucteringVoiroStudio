

from api.LLM.エージェント.会話用エージェント.返答判定機.LLM判定機ファクトリー import LLM判定機ファクトリー
from api.LLM.エージェント.会話用エージェント.返答判定機.UserInput import c未完全入力


def LLM判定テスト():
    #入力inputを無限ループさせてテストする
    llm判定機 = LLM判定機ファクトリー.Gemini判定機作成()
    while True:
        text = input("入力してください:")
        if text == "exit":
            break
        print("判定中...")
        result = llm判定機.f判定(c未完全入力(text))
        print(result)
        print("判定完了")