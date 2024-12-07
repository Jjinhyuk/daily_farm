from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.user import UserType, AuthProvider

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    full_name: Optional[str] = None
    user_type: Optional[UserType] = UserType.CUSTOMER

class UserCreate(UserBase):
    email: EmailStr
    password: str

class UserSocialCreate(UserBase):
    email: EmailStr
    social_id: str
    auth_provider: AuthProvider
    profile_image: Optional[str] = None

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    email: EmailStr
    auth_provider: AuthProvider
    
    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: Optional[str] = None