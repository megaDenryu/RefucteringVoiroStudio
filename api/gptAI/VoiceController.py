from api.Extend.BaseModel.ExtendBaseModel import HashableBaseModel

"""
各ボイロで違うしコントロールしたいものも違うので長考
"""
class VoiceState(HashableBaseModel):
    scale:int

