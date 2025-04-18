from pydantic import BaseModel,Field

class EmotionVector(BaseModel):
    """
    キャラクターの感情ベクトルを表すクラス。
    感情の強さを数値で表現するためのプロパティを持つ。
    """
    感情:str = Field(description="感情をポエム的に表現")
    感情の強さ:int = Field(description="感情の強さを数値で表現")
    @classmethod
    def 無(cls) -> "EmotionVector":
        """感情ベクトルの初期化"""
        return EmotionVector(
            感情="",
            感情の強さ=0
        )

class ThoughtNode3(BaseModel):
    """思考の連鎖における単一のノード（問い、思考、応答）を表します。"""
    a問い: str
    b自由思考欄: list[str]
    c回答: list[str] = Field(description= "上記の問いや思考に対するキャラクターの応答。問がむずかしい場合は分からないが回答になってもよい。")
    e感情ベクトル: EmotionVector

class ThoughtNode2(BaseModel):
    """思考の連鎖における単一のノード（問い、思考、応答）を表します。"""
    a問い: str
    b自由思考欄: list[str]
    c回答: list[str] = Field(description= "上記の問いや思考に対するキャラクターの応答。問がむずかしい場合は分からないが回答になってもよい。")
    dさらなる自問自答:list[ThoughtNode3] = Field(description= "上記の問いや思考に続く思考・問い")
    e感情ベクトル: EmotionVector

class ThoughtNode(BaseModel):
    """思考の連鎖における単一のノード（問い、思考、応答）を表します。"""
    a問い: str
    b自由思考欄: list[str]
    c回答: list[str] = Field(description= "上記の問いや思考に対するキャラクターの応答。問がむずかしい場合は分からないが回答になってもよい。")
    dさらなる自問自答:list[ThoughtNode2] = Field(description= "上記の問いや思考に続く思考・問い")
    e感情ベクトル: EmotionVector

class InternalMonologue(BaseModel):
    """
    キャラクターの内面的な思考プロセス（自問自答、葛藤）全体を構造化したモデル。
    """
    # プロパティ名を、元の説明に近い、より情報量の多い日本語フレーズに変更
    a感情ベクトル: EmotionVector
    b意味や目的への自問自答: list[ThoughtNode] = Field(description="ハイデガー的解釈：存在の意味、状況の意味への問い")
    c可能性や選択への自問自答: list[ThoughtNode] = Field(description="ハイデガー的解釈：自己の可能性への投企、選択の自由と責任に関わる問い")
    d自己や他者や規範への自問自答: list[ThoughtNode] = Field(description="ハイデガー的解釈：本来性/非本来性、共同存在、世人（ダス・マン）の規範への問い")
    e価値や優先順位への自問自答: list[ThoughtNode] = Field(description="ハイデガー的解釈：価値の優先順位、選択の基準に関する問い")
    f状況や前提への自問自答: list[ThoughtNode]
    gその他の未分類の自問自答: list[ThoughtNode]
