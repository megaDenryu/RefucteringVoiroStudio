import asyncio
from api.Extend.RxTool.AsyncReactiveProperty import AsyncReactiveProperty


async def main():
    # 非同期リアクティブプロパティを作成
    prop = AsyncReactiveProperty[int](0)
    
    # 非同期コールバックを登録
    async def async_callback(x):
        await asyncio.sleep(1)  # 何らかの非同期処理
        print(f"Async callback: {x}")
    
    prop.add_async_method(async_callback)
    
    # 非同期でセットして両方のコールバックを実行
    await prop.set_async(42)
    
    # 同期でセットして同期コールバックのみ実行
    prop.set(24)

# asyncio.run(main())