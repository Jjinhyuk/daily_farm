from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.crud.base import CRUDBase
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.crop import Crop
from app.schemas.cart import CartCreate, CartItemCreate, CartItemUpdate

class CRUDCart(CRUDBase[Cart, CartCreate, CartCreate]):
    def get_by_user(self, db: Session, *, user_id: int) -> Optional[Cart]:
        return db.query(Cart).filter(Cart.user_id == user_id).first()

    def get_or_create(self, db: Session, *, user_id: int) -> Cart:
        cart = self.get_by_user(db, user_id=user_id)
        if not cart:
            current_time = datetime.utcnow().isoformat()
            cart = Cart(
                user_id=user_id,
                created_at=current_time,
                updated_at=current_time
            )
            db.add(cart)
            db.commit()
            db.refresh(cart)
        return cart

    def add_item(
        self, db: Session, *, cart_id: int, item_in: CartItemCreate
    ) -> CartItem:
        current_time = datetime.utcnow().isoformat()
        db_item = CartItem(
            cart_id=cart_id,
            crop_id=item_in.crop_id,
            quantity=item_in.quantity,
            created_at=current_time,
            updated_at=current_time
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    def update_item(
        self, db: Session, *, cart_id: int, item_id: int, item_in: CartItemUpdate
    ) -> Optional[CartItem]:
        db_item = db.query(CartItem).filter(
            and_(CartItem.cart_id == cart_id, CartItem.id == item_id)
        ).first()
        if not db_item:
            return None
            
        current_time = datetime.utcnow().isoformat()
        for field, value in item_in.dict(exclude_unset=True).items():
            setattr(db_item, field, value)
        db_item.updated_at = current_time
        
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    def remove_item(
        self, db: Session, *, cart_id: int, item_id: int
    ) -> bool:
        db_item = db.query(CartItem).filter(
            and_(CartItem.cart_id == cart_id, CartItem.id == item_id)
        ).first()
        if not db_item:
            return False
            
        db.delete(db_item)
        db.commit()
        return True

    def get_cart_with_items(
        self, db: Session, *, cart_id: int
    ) -> Optional[Dict[str, Any]]:
        cart = db.query(Cart).filter(Cart.id == cart_id).first()
        if not cart:
            return None
            
        # 장바구니 아이템과 관련 작물 정보 조회
        items = []
        total_price = 0
        
        for item in cart.items:
            crop = db.query(Crop).filter(Crop.id == item.crop_id).first()
            if crop:
                item_dict = {
                    "id": item.id,
                    "cart_id": item.cart_id,
                    "crop_id": item.crop_id,
                    "quantity": item.quantity,
                    "created_at": item.created_at,
                    "updated_at": item.updated_at,
                    "crop": {
                        "id": crop.id,
                        "name": crop.name,
                        "price_per_unit": crop.price_per_unit,
                        "unit": crop.unit,
                        "images": crop.images,
                        "farmer": {
                            "id": crop.farmer.id,
                            "full_name": crop.farmer.full_name,
                            "farm_name": crop.farmer.farm_name
                        }
                    }
                }
                items.append(item_dict)
                total_price += crop.price_per_unit * item.quantity
        
        return {
            "id": cart.id,
            "user_id": cart.user_id,
            "created_at": cart.created_at,
            "updated_at": cart.updated_at,
            "items": items,
            "total_price": total_price
        }

    def clear_cart(self, db: Session, *, cart_id: int) -> bool:
        db.query(CartItem).filter(CartItem.cart_id == cart_id).delete()
        db.commit()
        return True

cart = CRUDCart(Cart) 