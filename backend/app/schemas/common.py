from pydantic import BaseModel


class MessageResponse(BaseModel):
    message: str


class PlaceholderResponse(BaseModel):
    message: str
    modules: list[str]
