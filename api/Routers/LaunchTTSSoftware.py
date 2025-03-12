from fastapi import APIRouter
from pydantic import BaseModel

from api.Extend.ExtendFunc import ExtendFunc
from api.TtsSoftApi.TTSSoftwareManager import TTSSoftwareManager
from api.gptAI.HumanInfoValueObject import TTSSoftware

router = APIRouter()

class LaunchTTSSoftwareReq(BaseModel):
    tts: TTSSoftware
class LaunchTTSSoftwareRes(BaseModel):
    message: str

@router.post("/LaunchTTSSoftware")
async def launchTTSSoftware(req: LaunchTTSSoftwareReq):
    # todo :TTSSoftwareを起動する
    tts = req.tts
    ExtendFunc.ExtendPrint("ボイスロイドの起動")
    state = await TTSSoftwareManager.tryStartTTSSoftware(tts)
    result = await TTSSoftwareManager.updateCharaList(tts,state)
    ExtendFunc.ExtendPrint("ボイスロイドの起動完了")

    if result == True:
        res = LaunchTTSSoftwareRes(message=f"{tts}を起動しました")
        return res.model_dump_json()
    else:
        res = LaunchTTSSoftwareRes(message=f"{tts}の起動に失敗しました")
        return res.model_dump_json()
