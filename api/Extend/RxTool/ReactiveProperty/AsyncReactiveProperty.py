import asyncio
from typing import Callable, Generic, List, TypeVar, Coroutine, Any, Union

T = TypeVar('T')

class AsyncReactiveProperty(Generic[T]):
    def __init__(self, value: T):
        self._value: T = value
        self.async_methods: List[Callable[[T], Coroutine[Any, Any, None]]] = []

    @property
    def value(self) -> T:
        return self._value

    @value.setter
    def value(self, new_value: T):
        self._value = new_value

    async def execute_async_methods(self, value: T) -> None:
        if not self.async_methods:
            return
        
        # すべての非同期メソッドを並行実行
        await asyncio.gather(*(method(value) for method in self.async_methods))

    def get(self) -> T:
        return self._value

    def set(self, value: T) -> None:
        """同期的に値をセットし、非同期メソッドを実行"""
        self._value = value
        asyncio.run(self.execute_async_methods(value))
        
    async def set_async(self, value: T) -> None:
        """非同期的に値をセットし、同期と非同期の両方のメソッドを実行"""
        self._value = value
        await self.execute_async_methods(value)

    def set_without_event(self, value: T) -> None:
        """イベントを発行せずに値をセット"""
        self._value = value

    def add_async_method(self, event: Callable[[T], Coroutine[Any, Any, None]]) -> None:
        """非同期メソッドを登録"""
        self.async_methods.append(event)

    def clear_methods(self) -> None:
        """すべてのメソッドをクリア"""
        self.async_methods = []