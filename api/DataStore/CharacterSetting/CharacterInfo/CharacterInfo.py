

from pydantic import BaseModel
from api.AppSettingJson.CharcterAISetting import CharacterAISetting
from api.gptAI.HumanInfoValueObject import CharacterName, HumanImage, NickName


class CharacterInfo(BaseModel):
    characterName: CharacterName
    nickName: NickName
    humanImage: HumanImage
    aiSetting: CharacterAISetting






    