

import json
from typing import TypedDict
from fastapi import WebSocket, WebSocketDisconnect
from api.InstanceManager.InstanceManager import InastanceManager
from api.gptAI.Human import Human
from api.gptAI.HumanInfoValueObject import CharacterId
from api.gptAI.HumanInformation import CharacterModeState, ICharacterModeState


class MessageUnit(TypedDict):
    text: str
    characterModeState: ICharacterModeState|None

class SendData(TypedDict):
    messages: list[MessageUnit]

async def speakVoiceRoid(websocket: WebSocket, client_id: str):
    # クライアントとのコネクション確立
    await websocket.accept()
    inastanceManager = InastanceManager.singleton()
    inastanceManager.clientWs.setClientWs(client_id, websocket)
    try:
        while True:
            datas:SendData = json.loads(await websocket.receive_text()) 
            for message_unit in datas["messages"]:
                text = message_unit["text"]
                if message_unit["characterModeState"] is not None: #ここNoneにならないようにできるだろたぶん
                    characterModeState = CharacterModeState.fromDict(message_unit["characterModeState"])
                    inastanceManager.humanInstances.updateHumanModeState(characterModeState)
                    human_ai:Human|None = inastanceManager.humanInstances.tryGetHuman(characterModeState.id)
                    if human_ai is not None:
                        await inastanceManager.epic.appendMessageAndNotify({characterModeState.id:text})#作り直す
                        rubi_sentence = await human_ai.aiRubiConverter.convertAsync(text)
                        if rubi_sentence == None:
                            return
                        for sentence in Human.parseSentenseList(rubi_sentence):
                            for reciever in nikonama_comment_reciever_list.values():
                                reciever.checkAndStopRecieve(sentence)
                        
                    
    except WebSocketDisconnect:
        print("wsエラーです:speakVoiceRoid")
