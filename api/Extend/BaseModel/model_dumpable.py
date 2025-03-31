from typing import Any, Protocol, runtime_checkable  # typing.Protocol をインポート

@runtime_checkable
class IModelDumpAble(Protocol):  # Protocol を継承
    def model_dump(self) -> dict|list: ...