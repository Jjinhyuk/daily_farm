from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.crud.base import CRUDBase
from app.models.review import Review
from app.models.order import Order, OrderStatus
from app.schemas.review import ReviewCreate, ReviewUpdate

class CRUDReview(CRUDBase[Review, ReviewCreate, ReviewUpdate]):
    def create_with_user(
        self, db: Session, *, obj_in: ReviewCreate, user_id: int
    ) -> Review:
        # 주문 확인
        order = db.query(Order).filter(
            and_(
                Order.id == obj_in.order_id,
                Order.consumer_id == user_id,
                Order.status == OrderStatus.DELIVERED
            )
        ).first()
        if not order:
            raise ValueError("Invalid order or order not delivered")
        
        # 이미 리뷰가 있는지 확인
        existing_review = db.query(Review).filter(
            Review.order_id == obj_in.order_id
        ).first()
        if existing_review:
            raise ValueError("Review already exists for this order")
        
        current_time = datetime.utcnow().isoformat()
        db_obj = Review(
            **obj_in.dict(),
            user_id=user_id,
            created_at=current_time,
            updated_at=current_time
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Review]:
        return (
            db.query(Review)
            .filter(Review.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_crop(
        self, db: Session, *, crop_id: int, skip: int = 0, limit: int = 100
    ) -> List[Review]:
        return (
            db.query(Review)
            .filter(Review.crop_id == crop_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_review_with_details(
        self, db: Session, *, review_id: int
    ) -> Optional[Dict[str, Any]]:
        review = db.query(Review).filter(Review.id == review_id).first()
        if not review:
            return None
            
        return {
            "id": review.id,
            "rating": review.rating,
            "content": review.content,
            "created_at": review.created_at,
            "updated_at": review.updated_at,
            "user": {
                "id": review.user.id,
                "full_name": review.user.full_name,
                "profile_image": review.user.profile_image
            },
            "crop": {
                "id": review.crop.id,
                "name": review.crop.name,
                "images": review.crop.images
            }
        }

    def update(
        self, db: Session, *, db_obj: Review, obj_in: ReviewUpdate
    ) -> Review:
        update_data = obj_in.dict(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow().isoformat()
        return super().update(db, db_obj=db_obj, obj_in=update_data)

review = CRUDReview(Review) 