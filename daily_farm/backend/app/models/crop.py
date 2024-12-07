from sqlalchemy import Boolean, Column, Integer, String, Float, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class CropStatus(str, enum.Enum):
    GROWING = "GROWING"
    HARVESTED = "HARVESTED"
    SOLD = "SOLD"


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String, index=True)
    description = Column(String)
    price_per_unit = Column(Float)
    unit = Column(String)  # kg, piece, etc.
    quantity_available = Column(Float)
    status = Column(Enum(CropStatus))
    
    # Crop details
    planting_date = Column(String)
    expected_harvest_date = Column(String)
    actual_harvest_date = Column(String, nullable=True)
    
    # Growing conditions
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    soil_ph = Column(Float, nullable=True)
    
    # Images
    images = Column(JSON, default=list)  # List of S3 URLs
    
    # Timestamps
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat(), onupdate=lambda: datetime.utcnow().isoformat())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    farmer = relationship("User", back_populates="crops")
    reviews = relationship("Review", back_populates="crop", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="crop", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="crop", cascade="all, delete-orphan")