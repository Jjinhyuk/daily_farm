from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"))
    crop_id = Column(Integer, ForeignKey("crops.id", ondelete="CASCADE"))
    quantity = Column(Float)
    price_per_unit = Column(Float)  # Price at the time of order
    total_price = Column(Float)
    
    # Timestamps
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat(), onupdate=lambda: datetime.utcnow().isoformat())

    # Relationships
    order = relationship("Order", back_populates="items")
    crop = relationship("Crop", back_populates="order_items")

    def calculate_total_price(self) -> float:
        """Calculate total price for this order item."""
        return float(self.quantity * self.price_per_unit)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    consumer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    farmer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    
    # Order details
    total_price = Column(Float)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    
    # Delivery info
    delivery_address = Column(String)
    delivery_contact = Column(String)
    tracking_number = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat(), onupdate=lambda: datetime.utcnow().isoformat())
    confirmed_at = Column(String, nullable=True)
    shipped_at = Column(String, nullable=True)
    delivered_at = Column(String, nullable=True)
    cancelled_at = Column(String, nullable=True)

    # Relationships
    consumer = relationship("User", foreign_keys=[consumer_id], back_populates="customer_orders")
    farmer = relationship("User", foreign_keys=[farmer_id], back_populates="farmer_orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="order", cascade="all, delete-orphan")

    def calculate_total_price(self) -> float:
        """Calculate total price for all items in the order."""
        return sum(item.calculate_total_price() for item in self.items) if self.items else 0.0

    def update_total_price(self) -> None:
        """Update the total_price field based on order items."""
        self.total_price = self.calculate_total_price()