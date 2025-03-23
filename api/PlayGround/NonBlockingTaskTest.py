import asyncio

class NonBlockingTaskTest:
    

    @staticmethod
    async def awaitableFunc(input:str):
        print("10秒待ちます・・")
        await asyncio.sleep(10)
        print(input+"完了")
    
    @staticmethod
    def nonBlockingTask(input:str):
        asyncio.create_task(NonBlockingTaskTest.awaitableFunc(input))
        print("非同期処理が完了しました")

    @staticmethod
    async def mainloop():
        while True:
            message = input("会話を入力してください: ")
            NonBlockingTaskTest.nonBlockingTask(message)
    