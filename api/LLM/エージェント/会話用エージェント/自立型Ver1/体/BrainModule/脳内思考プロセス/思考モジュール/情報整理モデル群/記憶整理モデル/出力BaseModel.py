from pydantic import BaseModel

from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.報酬生成モデル.出力BaseModel import Benefit
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.出力BaseModel import EmotionVector

"""
記憶整理クエリプロキシは、記憶整理のためのクエリを管理するクラスです。

記憶の構造は広義の知識として考えられるものと、過去の状態を知識として持っておけばよくて今の値が大事な状態として考えられるものがある。
- 報酬：報酬ベクトルという型として持つ必要がある。
- 状況：状況の履歴として持つ必要がある
- 思考：今やってる思考は[自問自答,連想,専門家との会話で結論を出す,各種モデルを用いた思考]がある。しかし、疑問と想像と結論へのプロセスと結論を分けて保存して参照できる必要がある
上は
- 感情：
- 方針
- 計画、予定
- 目標
- 体験
- 価値観
- 知識
- 経験則
- ルール
- 直感
- 予測
- 直感
- 道徳
などがある。これらはenumとして定義してそれぞれの属性を持ったBaseModelとして持てばよいが、例えば知識のグラフ構造はどうするべきなのか？
jsonに保存するので保存する前には何かしらのBaseModelとして保持する必要があるのでその型を定義しないといけない。
ModelDumpableを受け取ってそれを適当にリストで保存し、適宜整理してという形のほうが実装は楽かもしれない。
"""
class OrganizingMemoryResultFlash(BaseModel):
    報酬: Benefit
    感情: EmotionVector

class OrganizingMemoryAsTheorem(BaseModel):
    命題: str
    真実か否か: str
    証明: str
    性質: str
    具体例: str
    関連事項: str

class OrganizingMemoryAsRule(BaseModel):
    ルール: str
    定義: str
    例: str
    関連事項: str

class OrganizingMemoryAsConcept(BaseModel):
    概念: str
    定義: str
    特徴: str
    例: str
    関連事項: str

class OrganizingMemoryAsQandA(BaseModel):
    問: str
    結論へ至る道筋: str
    結論: str
    関連事項: str

class OrganizingMemoryResult(BaseModel):
    定理:list[OrganizingMemoryAsTheorem]
    ルール:list[OrganizingMemoryAsRule]
    概念:list[OrganizingMemoryAsConcept]
    QandA:list[OrganizingMemoryAsQandA]
    方針: str
    計画: str
    目標: str
    体験したこと: str
    経験したこと: str
    価値観: str
    道徳: str   
    
    