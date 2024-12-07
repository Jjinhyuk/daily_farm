from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    
    # Timestamps
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat(), onupdate=lambda: datetime.utcnow().isoformat())
    
    # Relationships
    user = relationship("User", back_populates="cart", single_parent=True)
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    @property
    def total_price(self) -> float:
        """Calculate total price for all items in the cart."""
        return sum(item.total_price for item in self.items) if self.items else 0.0