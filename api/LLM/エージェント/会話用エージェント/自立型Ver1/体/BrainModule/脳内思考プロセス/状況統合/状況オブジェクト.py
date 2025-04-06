from api.Extend.ExtendFunc import TimeExtend


class 状況:
    時間: TimeExtend
    内容: str
    def __init__(self, 時間: TimeExtend, 内容: str):
        self.時間 = 時間
        self.内容 = 内容

    def toStr(self):
        return f"\n{str(self.時間)}:{self.内容}"

    def model_dump(self):
        return {
            "時間": str(self.時間),
            "内容": self.内容
        }
    
    @staticmethod
    def リスト化文章(状況リスト: list["状況"])->str:
        文章:str = ""
        for 状況オブジェクト in 状況リスト:
            文章 += 状況オブジェクト.toStr()
        return 文章
    
    @staticmethod
    def 並び替え(状況リスト: list["状況"])->list["状況"]:
        # 時間の早い順（昇順）でソート。たとえば、[13:00, 12:00, 14:00] というリストを並び替えると [12:00, 13:00, 14:00] になります。
        return sorted(状況リスト, key=lambda x: x.時間)
    
class 状況リスト:
    _状況リスト: list[状況]
    def __init__(self, 状況リスト: list[状況]):
        self._状況リスト = 状況リスト
    
    def __add__(self, 状況: "状況リスト"):
        return 状況リスト(self._状況リスト + 状況._状況リスト)
    
    def リスト化文章(self):
        return 状況.リスト化文章(self._状況リスト)
    
    def 並び替え(self):
        self._状況リスト = 状況.並び替え(self._状況リスト)

    def model_dump(self):
        return [状況.model_dump() for 状況 in self._状況リスト]
    
class 状況履歴:
    前状況: 状況リスト
    新状況: 状況リスト
    def __init__(self, 前状況: 状況リスト, 新状況: 状況リスト):
        self.前状況 = 前状況
        self.新状況 = 新状況
    def 新状況更新(self, 新状況: 状況リスト):
        self.前状況 = self.前状況 + self.新状況
        self.新状況 = 新状況

    def 新状況に追加(self, 状況: 状況):
        self.新状況._状況リスト.append(状況)
    
    @property
    def 全状況(self)->状況リスト:
        return self.前状況 + self.新状況

    def リスト化文章(self):
        return self.全状況.リスト化文章()
    def 並び替え(self):
        self.前状況.並び替え()
        self.新状況.並び替え()
    def model_dump(self):
        return {
            "前状況": self.前状況.model_dump(),
            "新状況": self.新状況.model_dump()
        }
    
    @staticmethod
    def 空の状況履歴を生成() -> "状況履歴":
        return 状況履歴(状況リスト([]), 状況リスト([]))