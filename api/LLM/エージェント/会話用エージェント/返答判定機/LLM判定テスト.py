

from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.エージェント.会話用エージェント.返答判定機.LLM判定機ファクトリー import LLM判定機ファクトリー
from api.LLM.エージェント.会話用エージェント.返答判定機.UserInput import c未完全入力


async def LLM判定テスト():
    #入力inputを無限ループさせてテストする
    llm判定機 = LLM判定機ファクトリー.Gemini判定機作成()
    # llm判定機 = LLM判定機ファクトリー.ChatGpt判定機作成()
    while True:
        text = input("入力してください:")
        if text == "exit":
            break
        print("判定中...")
        result = await llm判定機.f判定(c未完全入力(text))
        if isinstance(result, c未完全入力):
            ExtendFunc.ExtendPrint(["未完全入力",result.buffer_text])
        else:
            ExtendFunc.ExtendPrint(["完全入力",result.buffer_text,result.should_respond])
        print("判定完了")