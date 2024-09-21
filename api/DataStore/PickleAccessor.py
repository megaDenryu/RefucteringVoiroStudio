import pickle
from pprint import pprint
import sys
from pathlib import Path
from api.Extend.ExtendFunc import ExtendFunc, TimeExtend
import aiofiles

class PickleAccessor:
    path = ExtendFunc.getTargetDirFromParents(__file__, "api")
    def __init__(self) -> None:
        pass

    @classmethod
    def save(cls, data, file_path:Path):
        with open(file_path, 'wb') as f:
            pickle.dump(data, f)
    
    @classmethod
    def load(cls,file_path:Path):
        with open(file_path, 'rb') as f:
            return pickle.load(f)
        
    @classmethod
    def saveMemory(cls, data, chara_name:str):
        file_path = cls.path / f"AIMemoryPickle/{chara_name}.pickle"
        cls.save(data, file_path)
    
    @classmethod
    def loadMemory(cls, chara_name:str):
        file_path = cls.path / f"AIMemoryPickle/{chara_name}.pickle"
        if not file_path.exists():
            return None
        return cls.load(file_path)

class PickleAsyncAccessor:
    path = Path("/some/default/path")

    @classmethod
    async def save(cls, data, file_path):
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(pickle.dumps(data))

    @classmethod
    async def load(cls, file_path):
        async with aiofiles.open(file_path, 'rb') as f:
            data = await f.read()
            return pickle.loads(data)

    @classmethod
    async def saveMemory(cls, data, chara_name: str):
        file_path = cls.path / f"AIMemoryPickle/{chara_name}.pickle"
        await cls.save(data, file_path)

    @classmethod
    async def loadMemory(cls, chara_name: str):
        file_path = cls.path / f"AIMemoryPickle/{chara_name}.pickle"
        return await cls.load(file_path)
    
