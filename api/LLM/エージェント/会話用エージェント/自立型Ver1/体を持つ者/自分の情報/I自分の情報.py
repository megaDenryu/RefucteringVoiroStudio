
from abc import ABC, abstractmethod


class I自分の情報コンテナ(ABC):
    """
    文章にできるものとベクトル化したいものがある。自分の情報は時間変化するので状態も含む。
    静的な情報：ベクトル、文章
    動的な情報：ベクトル、文章、状態
    """
    @property
    @abstractmethod
    def id(self)->str:
        pass

    @property
    @abstractmethod
    def 表示名(self)->str:
        pass

    @property
    @abstractmethod
    def 自分の情報(self)->str:
        pass

    @abstractmethod
    def 自分の情報の更新(self)->None:
        """
        自分の情報を更新する。
        """
        pass

