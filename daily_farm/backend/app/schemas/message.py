from typing import Optional
from pydantic import BaseModel

class MessageBase(BaseModel):
    title: str
    content: str

class MessageCreate(MessageBase):
    receiver_id: int

class MessageUpdate(BaseModel):
    is_read: Optional[bool] = None

class MessageInDBBase(MessageBase):
    id: int
    user_id: int  # sender
    receiver_id: int
    is_read: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class Message(MessageInDBBase):
    sender: dict  # 보낸 사람 정보
    receiver: dict  # 받는 사람 정보 