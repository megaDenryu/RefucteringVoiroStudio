import asyncio
import inspect
from typing import Dict, Callable, TypeVar, Generic, List, Optional, Union, Awaitable, cast, overload
from api.Extend.ExtendFunc import ExtendFunc

T = TypeVar('T')
R = TypeVar('R')

# 同期または非同期関数を表す型
SyncOrAsyncCallable = Union[Callable[[T], None], Callable[[T], Awaitable[None]]]
# 戻り値型を明確に分ける - ここが重要な変更点
SyncCallable = Callable[[T], R]
AsyncCallable = Callable[[T], Awaitable[R]]

class AsyncEventDelegator(Generic[T]):
    def __init__(self):
        self._methods: Dict[str, SyncOrAsyncCallable[T]] = {}
    
    def add_method(self, event: SyncOrAsyncCallable[T], key: str) -> None:
        if key in self._methods:
            return
        self._methods[key] = event
    
    def has_method(self, key: str) -> bool:
        return key in self._methods
    
    async def async_invoke(self, value: T, key: Optional[str] = None) -> None:
        if key is None:
            # コールバック実行中の変更を防ぐためコピー
            methods_copy = dict(self._methods)
            tasks = []
            
            for k, method in methods_copy.items():
                try:
                    if inspect.iscoroutinefunction(method):
                        # 非同期関数の場合はタスクを作成
                        tasks.append(method(value))
                    else:
                        # 同期関数の場合はそのまま実行
                        method(value)
                except Exception as e:
                    ExtendFunc.ExtendPrint(f"Error invoking method {k}: {e}")
            
            # すべての非同期タスクが完了するのを待つ
            if tasks:
                await asyncio.gather(*tasks, return_exceptions=True)
        else:
            method = self._methods.get(key)
            if method:
                try:
                    if inspect.iscoroutinefunction(method):
                        await method(value)
                    else:
                        method(value)
                except Exception as e:
                    ExtendFunc.ExtendPrint(f"Error invoking method {key}: {e}")
            else:
                ExtendFunc.ExtendPrint(f"Method not found for key: {key}")
    
    # 同期的にノンブロッキングでイベントを実行
    def invoke(self, value: T, key: Optional[str] = None) -> None:
        asyncio.run(self.async_invoke(value, key))
    
    async def invoke_by_queue(self, value: T, keys: List[str]) -> None:
        for key in keys:
            method = self._methods.get(key)
            if method:
                try:
                    if inspect.iscoroutinefunction(method):
                        await method(value)
                    else:
                        method(value)
                except Exception as e:
                    ExtendFunc.ExtendPrint(f"Error invoking method {key}: {e}")
            else:
                ExtendFunc.ExtendPrint(f"Method not found for key: {key}")
    
    def remove_method(self, key: str) -> None:
        if key in self._methods:
            del self._methods[key]
    
    def clear_methods(self) -> None:
        self._methods.clear()


# 完全に再設計したAsyncActionDelegator
class AsyncActionDelegator(Generic[T, R]):
    def __init__(self):
        self._sync_method: Optional[SyncCallable[T, R]] = None
        self._async_method: Optional[AsyncCallable[T, R]] = None
    
    # オーバーロードシグネチャを追加して型推論を改善
    @overload
    def set_method(self, event: SyncCallable[T, R]) -> None: ...
    
    @overload
    def set_method(self, event: AsyncCallable[T, R]) -> None: ...
    
    def set_method(self, event: Union[SyncCallable[T, R], AsyncCallable[T, R]]) -> None:
        # 型を明確に分離して格納
        if inspect.iscoroutinefunction(event):
            self._async_method = event
            self._sync_method = None
        else:
            self._sync_method = cast(SyncCallable[T, R], event)
            self._async_method = None
    
    async def async_invoke(self, value: T) -> Optional[R]:
        try:
            if self._async_method is not None:
                return await self._async_method(value)
            elif self._sync_method is not None:
                return self._sync_method(value)
            else:
                ExtendFunc.ExtendPrint("Method not set")
                return None
        except Exception as e:
            ExtendFunc.ExtendPrint(f"Error invoking method: {e}")
            return None
    
    def invoke(self, value: T) -> Optional[R]:
        # 同期メソッドの場合は直接実行して結果を返す
        if self._sync_method is not None:
            try:
                return self._sync_method(value)
            except Exception as e:
                ExtendFunc.ExtendPrint(f"Error invoking sync method: {e}")
                return None
        # 非同期メソッドは新しいイベントループで実行
        elif self._async_method is not None:
            return asyncio.run(self.async_invoke(value))
        else:
            ExtendFunc.ExtendPrint("Method not set")
            return None
    
    def clear_method(self) -> None:
        self._sync_method = None
        self._async_method = None