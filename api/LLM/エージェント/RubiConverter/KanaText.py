from pydantic import BaseModel


class KanaText(BaseModel):
    下ネタならtrue: bool
    エラー処理が必要ならtrue: bool
    最終出力ユーザーの発言のフリガナ化文章: str