from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: Optional[str] = None
    is_active: Optional[bool] = True
    full_name: Optional[str] = None

class UserCreate(UserBase):
    email: str
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class User(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

class UserInDB(User):
    hashed_password: str 