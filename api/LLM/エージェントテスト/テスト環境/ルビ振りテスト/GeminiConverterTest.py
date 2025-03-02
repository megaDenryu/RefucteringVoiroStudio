
from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter
from api.LLM.エージェント.RubiConverter.RubiConverterUnitDictFactory import AIRubiConverterFactory
from api.LLM.エージェントテスト.テストツール.決まった入力を複数渡すテスト import 非同期連続入力テスト
from api.LLM.エージェントテスト.テストツール.無限ループ会話 import 非同期無限会話テスト


def Gemini2flashの無限会話テストユニット():
    geminiConverter = AIRubiConverterFactory.create().setMode(AISentenceConverter.Gemini)
    非同期無限会話テスト(geminiConverter.convertAsync)

def ChatGpt2flashの無限会話テストユニット():
    chatGptConverter = AIRubiConverterFactory.create().setMode(AISentenceConverter.ChatGPT)
    非同期無限会話テスト(chatGptConverter.convertAsync)

def Geminiの連続会話テストユニット():
    geminiConverter = AIRubiConverterFactory.create().setMode(AISentenceConverter.Gemini)
    入力リスト = [
        "楕円関数のグラフを書くプログラムを書きたいな",
        "俺は何て言えばいいんだろう"
    ]
    非同期連続入力テスト(geminiConverter.convertAsync,入力リスト)

def ChatGptの連続会話テストユニット():
    chatGptConverter = AIRubiConverterFactory.create().setMode(AISentenceConverter.ChatGPT)
    入力リスト = [
        "楕円関数のグラフを書くプログラムを書きたいな",
        "俺は何て言えばいいんだろう"
    ]
    非同期連続入力テスト(chatGptConverter.convertAsync,入力リスト)
