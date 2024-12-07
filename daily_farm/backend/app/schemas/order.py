from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.order import OrderStatus

class OrderItemBase(BaseModel):
    crop_id: int
    quantity: float = Field(gt=0)
    price_per_unit: float = Field(gt=0)

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemInDBBase(OrderItemBase):
    id: int
    order_id: int
    total_price: float
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class OrderItem(OrderItemInDBBase):
    crop: dict  # 작물 정보를 포함

class OrderBase(BaseModel):
    consumer_id: int
    farmer_id: int
    delivery_address: str
    delivery_contact: str

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    tracking_number: Optional[str] = None

class OrderInDBBase(OrderBase):
    id: int
    status: OrderStatus
    total_price: float
    tracking_number: Optional[str] = None
    created_at: str
    updated_at: str
    confirmed_at: Optional[str] = None
    shipped_at: Optional[str] = None
    delivered_at: Optional[str] = None
    cancelled_at: Optional[str] = None

    class Config:
        from_attributes = True

class Order(OrderInDBBase):
    items: List[OrderItem] = []
    consumer: dict  # 구매자 정보
    farmer: dict  # 농부 정보 