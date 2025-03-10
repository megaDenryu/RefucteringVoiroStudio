from pydantic import BaseModel


class SpeakerInfo(BaseModel):
    speakerId:str

    def __init__(self, speakerId:str):
        self.speakerId = speakerId