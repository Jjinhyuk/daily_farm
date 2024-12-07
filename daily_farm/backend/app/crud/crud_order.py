from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.crud.base import CRUDBase
from app.models.order import Order, OrderStatus
from app.models.crop import Crop
from app.schemas.order import OrderCreate, OrderUpdate

class CRUDOrder(CRUDBase[Order, OrderCreate, OrderUpdate]):
    def create_with_items(
        self, db: Session, *, obj_in: OrderCreate
    ) -> Order:
        current_time = datetime.utcnow().isoformat()
        
        # 주문 생성
        db_obj = Order(
            consumer_id=obj_in.consumer_id,
            farmer_id=obj_in.farmer_id,
            delivery_address=obj_in.delivery_address,
            delivery_contact=obj_in.delivery_contact,
            status=OrderStatus.PENDING,
            total_price=0,  # 아이템 추가 후 계산
            created_at=current_time,
            updated_at=current_time
        )
        db.add(db_obj)
        db.flush()  # ID 생성을 위해 flush
        
        # 주문 아이템 추가 및 총 금액 계산
        total_price = 0
        for item in obj_in.items:
            # 작물 정보 조회 및 재고 확인
            crop = db.query(Crop).filter(Crop.id == item.crop_id).first()
            if not crop or crop.quantity_available < item.quantity:
                db.rollback()
                raise ValueError(f"Insufficient stock for crop {item.crop_id}")
            
            # 작물 재고 감소
            crop.quantity_available -= item.quantity
            if crop.quantity_available == 0:
                crop.status = "SOLD"
            
            # 주문 아이템 생성
            item_total = item.price_per_unit * item.quantity
            total_price += item_total
            
            db_item = OrderItem(
                order_id=db_obj.id,
                crop_id=item.crop_id,
                quantity=item.quantity,
                price_per_unit=item.price_per_unit,
                total_price=item_total,
                created_at=current_time,
                updated_at=current_time
            )
            db.add(db_item)
        
        # 총 금액 업데이트
        db_obj.total_price = total_price
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_consumer(
        self, db: Session, *, consumer_id: int, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        return (
            db.query(Order)
            .filter(Order.consumer_id == consumer_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_farmer(
        self, db: Session, *, farmer_id: int, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        return (
            db.query(Order)
            .filter(Order.farmer_id == farmer_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update_status(
        self, db: Session, *, order_id: int, status: OrderStatus, tracking_number: Optional[str] = None
    ) -> Optional[Order]:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return None
            
        current_time = datetime.utcnow().isoformat()
        
        # 상태별 타임스탬프 업데이트
        if status == OrderStatus.CONFIRMED:
            order.confirmed_at = current_time
        elif status == OrderStatus.SHIPPED:
            order.shipped_at = current_time
            if tracking_number:
                order.tracking_number = tracking_number
        elif status == OrderStatus.DELIVERED:
            order.delivered_at = current_time
        elif status == OrderStatus.CANCELLED:
            order.cancelled_at = current_time
            
            # 주문 취소 시 재고 복구
            for item in order.items:
                crop = db.query(Crop).filter(Crop.id == item.crop_id).first()
                if crop:
                    crop.quantity_available += item.quantity
                    if crop.status == "SOLD":
                        crop.status = "HARVESTED"
        
        order.status = status
        order.updated_at = current_time
        
        db.add(order)
        db.commit()
        db.refresh(order)
        return order

    def get_order_with_details(
        self, db: Session, *, order_id: int
    ) -> Optional[Dict[str, Any]]:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return None
            
        # 주문 아이템과 관련 정보 조회
        items = []
        for item in order.items:
            crop = db.query(Crop).filter(Crop.id == item.crop_id).first()
            if crop:
                item_dict = {
                    "id": item.id,
                    "order_id": item.order_id,
                    "crop_id": item.crop_id,
                    "quantity": item.quantity,
                    "price_per_unit": item.price_per_unit,
                    "total_price": item.total_price,
                    "created_at": item.created_at,
                    "updated_at": item.updated_at,
                    "crop": {
                        "id": crop.id,
                        "name": crop.name,
                        "unit": crop.unit,
                        "images": crop.images
                    }
                }
                items.append(item_dict)
        
        return {
            "id": order.id,
            "consumer_id": order.consumer_id,
            "farmer_id": order.farmer_id,
            "status": order.status,
            "total_price": order.total_price,
            "delivery_address": order.delivery_address,
            "delivery_contact": order.delivery_contact,
            "tracking_number": order.tracking_number,
            "created_at": order.created_at,
            "updated_at": order.updated_at,
            "confirmed_at": order.confirmed_at,
            "shipped_at": order.shipped_at,
            "delivered_at": order.delivered_at,
            "cancelled_at": order.cancelled_at,
            "items": items,
            "consumer": {
                "id": order.consumer.id,
                "full_name": order.consumer.full_name,
                "email": order.consumer.email
            },
            "farmer": {
                "id": order.farmer.id,
                "full_name": order.farmer.full_name,
                "farm_name": order.farmer.farm_name,
                "email": order.farmer.email
            }
        }

order = CRUDOrder(Order) 