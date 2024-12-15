

from pydantic import BaseModel


class AppSettingInitReq(BaseModel):
    page_mode: str
    client_id: str