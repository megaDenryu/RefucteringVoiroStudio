from abc import ABC, abstractmethod



class I思考状態(ABC):
    """
    思考状態のインターフェース
    """
    @abstractmethod
    def model_dump(self) -> dict|list:
        """
        思考状態をprimitiveに変換する
        """
        pass

