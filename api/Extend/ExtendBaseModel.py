from pydantic import BaseModel


class HashableBaseModel(BaseModel):
    def __hash__(self):
        return hash(frozenset(self.model_dump().items()))
    def __eq__(self, other):
        if isinstance(other, HashableBaseModel):
            return self.model_dump() == other.model_dump()
        return False