
import asyncio
from typing import Callable, TypeVar, NoReturn, Any, Awaitable

from api.Extend.ExtendFunc import ExtendFunc

# 処理関数の戻り値の型を汎用的にするためのジェネリック型
T = TypeVar('T')

def 無限会話テスト(処理関数オブジェクト: Callable[[str], T]) -> NoReturn:
    """
    ユーザーからの入力を無限に受け付け、指定された処理関数に渡す
    
    Args:
        処理関数オブジェクト: ユーザー入力を処理する関数（文字列を受け取る）
        
    Returns:
        この関数は意図的に無限ループするためNoReturnとマークされている
        （実際には KeyboardInterrupt などで中断される可能性がある）
    """
    while True:
        text: str = input("テキストを入力してください。")
        response = 処理関数オブジェクト(text)
        ExtendFunc.ExtendPrint(response)

async def 非同期無限会話ユニット(async処理関数オブジェクト: Callable[[str], Awaitable[T]]) -> NoReturn:
    """
    ユーザーからの入力を無限に受け付け、指定された非同期処理関数に渡す
    """
    while True:
        text: str = input("テキストを入力してください。")
        response = await async処理関数オブジェクト(text)
        ExtendFunc.ExtendPrint(response)

def 非同期無限会話テスト(async処理関数オブジェクト: Callable[[str], Awaitable[T]]):
    """
    非同期処理を実行するためのラッパー関数
    """
    asyncio.run(非同期無限会話ユニット(async処理関数オブジェクト))