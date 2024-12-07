from sqlalchemy import Column, Integer, Float, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id", ondelete="CASCADE"))
    crop_id = Column(Integer, ForeignKey("crops.id", ondelete="CASCADE"))
    quantity = Column(Float, default=1)
    
    # Timestamps
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat(), onupdate=lambda: datetime.utcnow().isoformat())

    # Relationships
    cart = relationship("Cart", back_populates="items")
    crop = relationship("Crop", back_populates="cart_items")

    @property
    def total_price(self) -> float:
        """Calculate total price for this cart item."""
        if self.crop and self.quantity:
            return float(self.crop.price_per_unit * self.quantity)
        return 0.0 