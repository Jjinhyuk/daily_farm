from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.crop import CropStatus

class FarmerInfo(BaseModel):
    id: int
    full_name: str
    farm_name: Optional[str] = None
    farm_location: Optional[str] = None

class CropBase(BaseModel):
    name: str
    description: Optional[str] = None
    price_per_unit: float = Field(gt=0)
    unit: str
    quantity_available: float = Field(ge=0)
    planting_date: str
    expected_harvest_date: str
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    soil_ph: Optional[float] = None

class CropCreate(CropBase):
    pass

class CropUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_per_unit: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = None
    quantity_available: Optional[float] = Field(None, ge=0)
    status: Optional[CropStatus] = None
    planting_date: Optional[str] = None
    expected_harvest_date: Optional[str] = None
    actual_harvest_date: Optional[str] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    soil_ph: Optional[float] = None
    images: Optional[List[str]] = None
    is_active: Optional[bool] = None

class CropInDBBase(CropBase):
    id: int
    farmer_id: int
    status: CropStatus
    actual_harvest_date: Optional[str] = None
    images: List[str] = []
    created_at: str
    updated_at: str
    is_active: bool

    class Config:
        from_attributes = True

class Crop(CropInDBBase):
    farmer: Optional[FarmerInfo] = None
    total_reviews: int = 0
    average_rating: float = 0.0
    total_orders: int = 0

# 센서 데이터 업데이트를 위한 스키마
class CropSensorUpdate(BaseModel):
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    soil_ph: Optional[float] = None

# 작물 상태 업데이트를 위한 스키마
class CropStatusUpdate(BaseModel):
    status: CropStatus
    actual_harvest_date: Optional[str] = None  # Required when status is HARVESTED