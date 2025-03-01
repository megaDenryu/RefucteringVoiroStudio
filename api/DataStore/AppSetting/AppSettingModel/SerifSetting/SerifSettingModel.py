

from pydantic import BaseModel, Field

from api.DataStore.ChatacterVoiceSetting.CommonFeature.CommonFeature import AISentenceConverter

#description="全てのキャラに対してAIによる文章変換を有効にするかどうかを一括設定できます。キャラ個別に設定したい場合はキャラクターのキャラ設定で行えます。"
#description="全てのキャラに対して読み上げ間隔の秒数を一括設定できます。キャラ個別に設定したい場合はキャラクターのキャラ設定で行えます。
class SerifSettingModel(BaseModel):
    AIによる文章変換: AISentenceConverter = Field(default=AISentenceConverter.無効, title="AIによる文章変換")
    読み上げ間隔: float = Field(ge=0.0, le=2.0, default=0.0, title="読み上げ間隔")
    