from typing import TypeAlias
from uuid import uuid4

from fastapi import WebSocket

ClientId: TypeAlias = str

class ClientIds:
    _client_ids:list[ClientId] = []
    def __init__(self):
        self._client_ids = []

    def createNewId(self):
        id = str(uuid4())
        while id in self._client_ids:
            id = str(uuid4())
        self._client_ids.append(id)
        return id
    
class ClientWebSocket:
    # クライアントのidと対応するwsを格納する配列類
    _client_ws:dict[ClientId,WebSocket]
    def __init__(self):
        self._client_ws = {}
    def setClientWs(self,client_id:ClientId,ws:WebSocket):
        self._client_ws[client_id] = ws
    def getClientWs(self,client_id:ClientId)->WebSocket:
        return self._client_ws[client_id]