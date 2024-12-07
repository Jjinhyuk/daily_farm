from typing import List, Optional
from pydantic import BaseModel, Field

class CartItemBase(BaseModel):
    crop_id: int
    quantity: float = Field(gt=0)

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: float = Field(gt=0)

class CartItemInDBBase(CartItemBase):
    id: int
    cart_id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class CartItem(CartItemInDBBase):
    crop: dict  # 작물 정보를 포함

class CartBase(BaseModel):
    user_id: int

class CartCreate(CartBase):
    pass

class CartInDBBase(CartBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class Cart(CartInDBBase):
    items: List[CartItem] = []
    total_price: float = 0 