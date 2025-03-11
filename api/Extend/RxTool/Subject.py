import asyncio
from typing import Generic, TypeVar, List, Dict, Any, Callable, Coroutine

T = TypeVar('T')

class Subject(Generic[T]):
    """複数のオブザーバーにデータをマルチキャストするクラス"""
    
    def __init__(self):
        self._observers: List[Callable[[T], None]] = []
        
    def subscribe(self, observer: Callable[[T], None]) -> Callable[[], None]:
        """オブザーバーを登録し、購読解除用の関数を返す"""
        self._observers.append(observer)
        
        def unsubscribe():
            if observer in self._observers:
                self._observers.remove(observer)
                
        return unsubscribe
    
    def notify(self, value: T) -> None:
        """全てのオブザーバーに値を通知"""
        for observer in self._observers[:]:  # コピーを使用して安全に反復
            observer(value)

class BehaviorSubject(Subject[T]):
    """最新の値を保持し、新規購読者に提供するサブジェクト"""
    
    def __init__(self, initial_value: T):
        super().__init__()
        self._value = initial_value
        
    @property
    def value(self) -> T:
        return self._value
        
    def subscribe(self, observer: Callable[[T], None]) -> Callable[[], None]:
        # 購読時に最新の値を即座に通知
        observer(self._value)
        return super().subscribe(observer)
    
    def notify(self, value: T) -> None:
        self._value = value
        super().notify(value)