import logging
from typing import Dict, Callable, TypeVar, Generic, List, Optional, Any, Union, AsyncIterable
import asyncio

from api.Extend.ExtendFunc import ExtendFunc

logger = logging.getLogger(__name__)

T = TypeVar('T')
R = TypeVar('R')

class EventDelegator(Generic[T]):
    def __init__(self):
        self._methods: Dict[str, Callable[[T], None]] = {}
    
    def add_method(self, event: Callable[[T], None], key: str) -> None:
        if key in self._methods:
            return
        self._methods[key] = event
    
    def has_method(self, key: str) -> bool:
        return key in self._methods
    
    def invoke(self, value: T, key: Optional[str] = None) -> None:
        if key is None:
            # コールバック実行中の変更を防ぐためコピー
            methods_copy = dict(self._methods)
            for k, method in methods_copy.items():
                try:
                    method(value)
                except Exception as e:
                    ExtendFunc.ExtendPrint(f"Error invoking method {k}: {e}")
        else:
            method = self._methods.get(key)
            if method:
                method(value)
            else:
                ExtendFunc.ExtendPrint(f"Method not found for key: {key}")
    
    def invoke_by_queue(self, value: T, keys: List[str]) -> None:
        for key in keys:
            method = self._methods.get(key)
            if method:
                method(value)
            else:
                ExtendFunc.ExtendPrint(f"Method not found for key: {key}")
    
    def remove_method(self, key: str) -> None:
        if key in self._methods:
            del self._methods[key]
    
    def clear_methods(self) -> None:
        self._methods.clear()


class ActionDelegator(Generic[T, R]):
    def __init__(self):
        self._method: Optional[Callable[[T], R]] = None
    
    def set_method(self, event: Callable[[T], R]) -> None:
        self._method = event
    
    def invoke(self, value: T) -> Optional[R]:
        if self._method:
            return self._method(value)
        else:
            ExtendFunc.ExtendPrint("Method not set")
            return None
    
    def clear_method(self) -> None:
        self._method = None