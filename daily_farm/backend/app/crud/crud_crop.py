from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from datetime import datetime

from app.crud.base import CRUDBase
from app.models.crop import Crop, CropStatus
from app.models.review import Review
from app.models.order import OrderItem
from app.schemas.crop import (
    CropCreate,
    CropUpdate,
    CropSensorUpdate,
    CropStatusUpdate
)

class CRUDCrop(CRUDBase[Crop, CropCreate, CropUpdate]):
    def create_with_farmer(
        self, db: Session, *, obj_in: CropCreate, farmer_id: int
    ) -> Crop:
        current_time = datetime.utcnow().isoformat()
        db_obj = Crop(
            **obj_in.dict(),
            farmer_id=farmer_id,
            status=CropStatus.GROWING,
            created_at=current_time,
            updated_at=current_time,
            images=[],
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_farmer(
        self, db: Session, *, farmer_id: int, skip: int = 0, limit: int = 100
    ) -> List[Crop]:
        return (
            db.query(self.model)
            .filter(Crop.farmer_id == farmer_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_with_stats(
        self, db: Session, *, id: int
    ) -> Optional[Dict[str, Any]]:
        crop = db.query(self.model).filter(self.model.id == id).first()
        if not crop:
            return None
            
        # Get review stats
        review_stats = db.query(
            func.count(Review.id).label("total_reviews"),
            func.avg(Review.rating).label("average_rating")
        ).filter(Review.crop_id == id).first()
        
        # Get order count
        order_count = db.query(func.count(OrderItem.id)).filter(
            OrderItem.crop_id == id
        ).scalar()
        
        return {
            "id": crop.id,
            "name": crop.name,
            "description": crop.description,
            "price_per_unit": crop.price_per_unit,
            "unit": crop.unit,
            "quantity_available": crop.quantity_available,
            "status": crop.status,
            "planting_date": crop.planting_date,
            "expected_harvest_date": crop.expected_harvest_date,
            "actual_harvest_date": crop.actual_harvest_date,
            "temperature": crop.temperature,
            "humidity": crop.humidity,
            "soil_ph": crop.soil_ph,
            "images": crop.images,
            "created_at": crop.created_at,
            "updated_at": crop.updated_at,
            "is_active": crop.is_active,
            "farmer": {
                "id": crop.farmer.id,
                "full_name": crop.farmer.full_name,
                "farm_name": crop.farmer.farm_name,
                "farm_location": crop.farmer.farm_location
            },
            "total_reviews": review_stats.total_reviews or 0,
            "average_rating": float(review_stats.average_rating or 0),
            "total_orders": order_count or 0
        }
    
    def update_sensor_data(
        self, db: Session, *, crop_id: int, obj_in: CropSensorUpdate
    ) -> Optional[Crop]:
        db_obj = db.query(Crop).filter(Crop.id == crop_id).first()
        if not db_obj:
            return None
            
        update_data = obj_in.dict(exclude_unset=True)
        current_time = datetime.utcnow().isoformat()
        update_data["updated_at"] = current_time
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update_status(
        self, db: Session, *, crop_id: int, obj_in: CropStatusUpdate
    ) -> Optional[Crop]:
        db_obj = db.query(Crop).filter(Crop.id == crop_id).first()
        if not db_obj:
            return None
            
        if obj_in.status == CropStatus.HARVESTED and not obj_in.actual_harvest_date:
            obj_in.actual_harvest_date = datetime.utcnow().isoformat()
            
        update_data = obj_in.dict(exclude_unset=True)
        current_time = datetime.utcnow().isoformat()
        update_data["updated_at"] = current_time
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_available_crops(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Dict[str, Any]]:
        # 작물 정보와 리뷰 통계를 함께 조회
        query = (
            db.query(
                self.model,
                func.count(Review.id).label("total_reviews"),
                func.avg(Review.rating).label("average_rating"),
                func.count(OrderItem.id).label("total_orders")
            )
            .outerjoin(Review, Review.crop_id == self.model.id)
            .outerjoin(OrderItem, OrderItem.crop_id == self.model.id)
            .filter(
                self.model.is_active == True,
                self.model.status == CropStatus.HARVESTED,
                self.model.quantity_available > 0
            )
            .group_by(self.model.id)
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        
        results = query.all()
        
        # 결과를 딕셔너리로 변환
        crops = []
        for crop, total_reviews, average_rating, total_orders in results:
            crop_dict = {
                "id": crop.id,
                "farmer_id": crop.farmer_id,
                "name": crop.name,
                "description": crop.description,
                "price_per_unit": crop.price_per_unit,
                "unit": crop.unit,
                "quantity_available": crop.quantity_available,
                "status": crop.status,
                "planting_date": crop.planting_date,
                "expected_harvest_date": crop.expected_harvest_date,
                "actual_harvest_date": crop.actual_harvest_date,
                "temperature": crop.temperature,
                "humidity": crop.humidity,
                "soil_ph": crop.soil_ph,
                "images": crop.images,
                "created_at": crop.created_at,
                "updated_at": crop.updated_at,
                "is_active": crop.is_active,
                "farmer": {
                    "id": crop.farmer.id,
                    "full_name": crop.farmer.full_name,
                    "farm_name": crop.farmer.farm_name,
                    "farm_location": crop.farmer.farm_location
                },
                "total_reviews": total_reviews or 0,
                "average_rating": float(average_rating or 0),
                "total_orders": total_orders or 0
            }
            crops.append(crop_dict)
        
        return crops
    
    def get_with_details(self, db: Session, *, id: int) -> Optional[Dict[str, Any]]:
        crop = db.query(self.model).filter(self.model.id == id).first()
        if not crop:
            return None

        # 리뷰 통계 계산
        reviews = db.query(Review).filter(Review.crop_id == id).all()
        total_reviews = len(reviews)
        average_rating = sum(review.rating for review in reviews) / total_reviews if total_reviews > 0 else 0

        # 주문 수 계산
        total_orders = db.query(OrderItem).filter(OrderItem.crop_id == id).count()

        return {
            "id": crop.id,
            "farmer_id": crop.farmer_id,
            "name": crop.name,
            "description": crop.description,
            "price_per_unit": crop.price_per_unit,
            "unit": crop.unit,
            "quantity_available": crop.quantity_available,
            "status": crop.status,
            "planting_date": crop.planting_date,
            "expected_harvest_date": crop.expected_harvest_date,
            "actual_harvest_date": crop.actual_harvest_date,
            "temperature": crop.temperature,
            "humidity": crop.humidity,
            "soil_ph": crop.soil_ph,
            "images": crop.images,
            "created_at": crop.created_at,
            "updated_at": crop.updated_at,
            "is_active": crop.is_active,
            "farmer": {
                "id": crop.farmer.id,
                "full_name": crop.farmer.full_name,
                "farm_name": crop.farmer.farm_name,
                "farm_location": crop.farmer.farm_location
            },
            "total_reviews": total_reviews,
            "average_rating": average_rating,
            "total_orders": total_orders
        }

crop = CRUDCrop(Crop) 