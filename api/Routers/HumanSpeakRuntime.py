

import json
from typing import TypedDict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from api.DataStore.CharacterSetting.CharacterSettingCollectionOperatorManager import CharacterSettingCollectionOperatorManager
from api.Extend.ExtendFunc import ExtendFunc
from api.InstanceManager.InstanceManager import InastanceManager
from api.gptAI.Human import Human
from api.gptAI.HumanInfoValueObject import CharacterId
from api.gptAI.HumanInformation import CharacterModeState, ICharacterModeState
from api.gptAI.VoiceInfo import SentenceInfo, SentenceOrWavSendData



class MessageUnit(TypedDict):
    text: str
    characterModeState: ICharacterModeState|None

class SendData(TypedDict):
    messages: list[MessageUnit]

router = APIRouter()

@router.websocket("/ws/{client_id}")
async def speakVoiceRoid(websocket: WebSocket, client_id: str):
    # クライアントとのコネクション確立
    await websocket.accept()
    inastanceManager = InastanceManager.singleton()
    inastanceManager.clientWs.setClientWs(client_id, websocket)
    try:
        while True:
            datas:SendData = json.loads(await websocket.receive_text()) 
            ExtendFunc.ExtendPrint(datas)
            for message_unit in datas["messages"]:
                text = message_unit["text"]
                if message_unit["characterModeState"] is None: #ここNoneにならないようにできるだろたぶん
                    continue
                characterModeState = CharacterModeState.fromDict(message_unit["characterModeState"])
                inastanceManager.humanInstances.updateHumanModeState(characterModeState)
                human_ai:Human|None = inastanceManager.humanInstances.tryGetHuman(characterModeState.id)
                if human_ai is None:
                    return
                epic_unit = {CharacterSettingCollectionOperatorManager.getNickNameFromSaveId(characterModeState.tts_software, characterModeState.id).name:text}
                # await inastanceManager.epic.appendMessageAndNotify(epic_unit)#作り直す
                rubi_sentence = await human_ai.aiRubiConverter.convertAsync(text)
                if rubi_sentence == None:
                    return
                for sentence in Human.parseSentenseList(rubi_sentence):
                    #wavデータを取得
                    wav_info = human_ai.outputWaveFile(sentence)
                    if wav_info == None:
                        return None
                    sentence_info:list[SentenceInfo] = [{
                            "characterModeState":human_ai.chara_mode_state.toDict(),
                            "sentence":sentence
                            }]
                    #バイナリーをjson形式で送信
                    send_data:SentenceOrWavSendData = {
                        "sentence":sentence_info,
                        "wav_info":wav_info,
                        "chara_type":"player"
                    }
                    await websocket.send_json(json.dumps(send_data))
                # daiaryに保存。重い操作なのでボイスを送ってから暇になってからやる。
                inastanceManager.diary.insertTodayMemo(text)
                        
                    
    except WebSocketDisconnect:
        print("wsエラーです:speakVoiceRoid")
