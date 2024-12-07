from sqlalchemy import Boolean, Column, Integer, String, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.core.database import Base

class UserType(str, enum.Enum):
    FARMER = "FARMER"
    CUSTOMER = "CUSTOMER"

class AuthProvider(str, enum.Enum):
    LOCAL = "LOCAL"
    GOOGLE = "GOOGLE"
    KAKAO = "KAKAO"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    is_active = Column(Boolean(), default=True)
    user_type = Column(SQLEnum(UserType, name="usertype", create_constraint=True, native_enum=False), default=UserType.CUSTOMER)
    
    # Auth related
    auth_provider = Column(SQLEnum(AuthProvider, name="authprovider", create_constraint=True, native_enum=False), default=AuthProvider.LOCAL)
    social_id = Column(String, nullable=True, unique=True)
    
    # Additional fields
    phone_number = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    
    # For farmers
    farm_name = Column(String, nullable=True)
    farm_location = Column(String, nullable=True)
    farm_description = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat(), onupdate=lambda: datetime.utcnow().isoformat())

    # Relationships
    crops = relationship("Crop", back_populates="farmer", cascade="all, delete-orphan")
    cart = relationship("Cart", back_populates="user", uselist=False, cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    
    # Messages
    sent_messages = relationship(
        "Message",
        foreign_keys="Message.sender_id",
        back_populates="sender",
        cascade="all, delete-orphan"
    )
    received_messages = relationship(
        "Message",
        foreign_keys="Message.receiver_id",
        back_populates="receiver",
        cascade="all, delete-orphan"
    )
    
    # Orders
    customer_orders = relationship(
        "Order",
        back_populates="consumer",
        foreign_keys="[Order.consumer_id]",
        cascade="all, delete-orphan"
    )
    farmer_orders = relationship(
        "Order",
        back_populates="farmer",
        foreign_keys="[Order.farmer_id]",
        cascade="all, delete-orphan"
    )
    