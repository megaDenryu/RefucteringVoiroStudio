from typing import Callable, TypeVar, List, Awaitable, Any, Generic
import asyncio

from api.Extend.ExtendFunc import ExtendFunc

# 処理結果の型を表す型変数
T = TypeVar('T')
# 入力の型を表す型変数
I = TypeVar('I')

def 連続入力テスト(処理関数オブジェクト: Callable[[I], T], 入力リスト: List[I]) -> List[T]:
    """
    あらかじめ定義された複数の入力を順番に処理する
    
    Args:
        処理関数オブジェクト: 入力を処理する関数
        入力リスト: テストしたい入力のリスト（任意の型I）
        
    Returns:
        各入力に対する処理結果のリスト
    """
    結果リスト: List[T] = []
    
    for i, 入力 in enumerate(入力リスト):
        response = 処理関数オブジェクト(入力)
        結果リスト.append(response)
        ExtendFunc.ExtendPrintWithTitle(f"テスト入力 {i+1}/{len(入力リスト)}",
                                        {"入力":入力,
                                         "結果":response})
    return 結果リスト

async def 非同期連続入力テストユニット(
    async処理関数オブジェクト: Callable[[I], Awaitable[T]], 
    入力リスト: List[I]
) -> List[T]:
    """
    あらかじめ定義された複数の入力を順番に非同期で処理する
    """
    結果リスト: List[T] = []
    
    for i, 入力 in enumerate(入力リスト):
        response = await async処理関数オブジェクト(入力)
        結果リスト.append(response)
        ExtendFunc.ExtendPrintWithTitle(f"テスト入力 {i+1}/{len(入力リスト)}",
                                        {"入力":入力,
                                         "結果":response})
    return 結果リスト

def 非同期連続入力テスト(
    async処理関数オブジェクト: Callable[[I], Awaitable[T]], 
    入力リスト: List[I]
) -> List[T]:
    """
    非同期連続入力テスト用のラッパー関数
    """
    return asyncio.run(非同期連続入力テストユニット(async処理関数オブジェクト, 入力リスト))