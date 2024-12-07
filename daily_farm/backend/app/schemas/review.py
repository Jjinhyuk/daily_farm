from typing import Optional
from pydantic import BaseModel, Field

class ReviewBase(BaseModel):
    rating: float = Field(ge=1, le=5)  # 1-5 별점
    content: str

class ReviewCreate(ReviewBase):
    crop_id: int
    order_id: int

class ReviewUpdate(BaseModel):
    rating: Optional[float] = Field(None, ge=1, le=5)
    content: Optional[str] = None

class ReviewInDBBase(ReviewBase):
    id: int
    user_id: int
    crop_id: int
    order_id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class Review(ReviewInDBBase):
    user: dict  # 사용자 정보
    crop: dict  # 작물 정보 