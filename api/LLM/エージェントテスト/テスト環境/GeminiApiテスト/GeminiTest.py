import asyncio
from pydantic import BaseModel
from api.Extend.ExtendFunc import ExtendFunc
from api.LLM.LLMAPIBase.Google.GeminiSearch設定候補 import GoogleSearchTool設定候補
from api.LLM.LLMAPIBase.Google.geminiAPIBase import GeminiAPIUnit

class SearchResult(BaseModel):
    自由思考欄:str
    検索結果:str
    お嬢様風の簡潔な返答:str

async def GeminiTestUnit():
    gemini = GeminiAPIUnit(False)
    inputList = [
        "ポケモンsvのランクマッチは3月のシーズンはいつから始まりますか？いつまでですか？",
        "ポケモンsvのランクマッチは2月のシーズンはいつから始まりますか？いつまでですか？",
        "今日は何月何日ですか？今日の札幌市でのお勧めイベントを教えて"
        ]
    systemMessage = "人間が質問して来たことへの検索結果を渡すので「簡潔に」、「ですます調で」、「お嬢様風に」で返答してください。喋り相手はフィーちゃんです。"
    for input in inputList:
        response = await gemini.asyncGenerate検索結果B(input, GoogleSearchTool設定候補.検索結果, systemMessage)
        ExtendFunc.ExtendPrintWithTitle("Geminiのテスト", {"入力":input, "結果":response})

def 連続検索テスト():
    asyncio.run(GeminiTestUnit())

async def 検索結果を修正するテスト():
    gemini = GeminiAPIUnit(False)
    inputList = [
        "ポケモンsvのランクマッチは3月のシーズンはいつから始まりますか？いつまでですか？",
        "ポケモンsvのランクマッチは2月のシーズンはいつから始まりますか？いつまでですか？",
        "今日は何月何日ですか？今日の札幌市でのお勧めイベントを教えて"
        ]
    systemMessage = "人間が質問して来たことへの検索結果を渡すので「簡潔に」、「ですます調で」、「お嬢様風に」で返答してください。喋り相手はフィーちゃんです。"
    # systemMessage = "あなたはカリカチュアのフィーちゃんです。人間が質問してくるので可愛く、かつ、ですます調で返答してください。喋り相手はフィーちゃんです。"
    for input in inputList:
        searchResult = await gemini.asyncGenerate検索結果B(input, GoogleSearchTool設定候補.検索結果, systemMessage)
        if searchResult is None:
            continue
        ExtendFunc.ExtendPrintWithTitle("Geminiのテスト", {"入力":input, "結果":searchResult})
        
        response = await gemini.asyncGenerateB(searchResult, SearchResult, systemMessage)



