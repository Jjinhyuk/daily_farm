from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    order_id = Column(Integer, ForeignKey("orders.id"))
    
    # Review content
    rating = Column(Float)  # 1-5 stars
    content = Column(String)
    
    # Timestamps
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat(), onupdate=lambda: datetime.utcnow().isoformat())

    # Relationships
    user = relationship("User", back_populates="reviews")
    crop = relationship("Crop", back_populates="reviews")
    order = relationship("Order", back_populates="reviews")
    