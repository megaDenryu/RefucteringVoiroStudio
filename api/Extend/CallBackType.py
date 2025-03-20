from collections.abc import Callable, Awaitable
from typing import TypeAlias

# 引数なしで何も返さない非同期関数の型
AsyncCallback: TypeAlias = Callable[[], Awaitable[None]]