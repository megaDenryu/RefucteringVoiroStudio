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
    状況リスト: list[状況]
    def __init__(self, 状況リスト: list[状況]):
        self.状況リスト = 状況リスト
    
    def リスト化文章(self):
        return 状況.リスト化文章(self.状況リスト)
    
    def 並び替え(self):
        self.状況リスト = 状況.並び替え(self.状況リスト)

    def model_dump(self):
        return [状況.model_dump() for 状況 in self.状況リスト]