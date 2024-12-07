import asyncio
import os
import sys
from datetime import datetime, timedelta
import random

# Add the project root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.insert(0, app_dir)

from app import crud, models
from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import UserType, AuthProvider
from app.schemas.auth import UserCreate
from app.schemas.crop import CropCreate, CropStatusUpdate
from app.models.crop import CropStatus, Crop
from app.models.user import User
from app.models.order import Order
from app.models.review import Review

async def create_test_data():
    db = SessionLocal()
    try:
        # 기존 데이터 삭제
        print("기존 테스트 데이터를 삭제하는 중...")
        db.query(Review).delete()
        db.query(Order).delete()
        db.query(Crop).delete()
        db.query(User).delete()
        db.commit()
        print("기존 데이터 삭제 완료")
        
        # 테스트 농부 생성
        farmer_in = UserCreate(
            email="farmer@example.com",
            password="testpassword123",
            full_name="테스트 농부",
            user_type=UserType.FARMER,
            is_active=True,
        )
        farmer = crud.user.create(db, obj_in=farmer_in)
        
        # 작물 샘플 데이터
        crops_data = [
            {
                "name": "방울토마토",
                "description": "당도가 높은 유기농 방울토마토입니다.",
                "price_per_unit": 5000,
                "unit": "kg",
                "quantity_available": 100,
                "planting_date": (datetime.now() - timedelta(days=60)).isoformat(),
                "expected_harvest_date": (datetime.now() + timedelta(days=30)).isoformat(),
                "temperature": 25.5,
                "humidity": 65.0,
                "soil_ph": 6.5,
            },
            {
                "name": "상추",
                "description": "무농약 상추입니다.",
                "price_per_unit": 3000,
                "unit": "단",
                "quantity_available": 50,
                "planting_date": (datetime.now() - timedelta(days=30)).isoformat(),
                "expected_harvest_date": (datetime.now() + timedelta(days=15)).isoformat(),
                "temperature": 22.0,
                "humidity": 70.0,
                "soil_ph": 6.8,
            },
            {
                "name": "딸기",
                "description": "달콤한 겨울 딸기입니다.",
                "price_per_unit": 8000,
                "unit": "kg",
                "quantity_available": 30,
                "planting_date": (datetime.now() - timedelta(days=45)).isoformat(),
                "expected_harvest_date": (datetime.now() + timedelta(days=45)).isoformat(),
                "temperature": 20.0,
                "humidity": 75.0,
                "soil_ph": 6.0,
            }
        ]
        
        # 작물 생성
        for crop_data in crops_data:
            crop_in = CropCreate(**crop_data)
            crop = crud.crop.create_with_farmer(db, obj_in=crop_in, farmer_id=farmer.id)
            
            # 랜덤하게 일부 작물은 수확 상태로 변경
            if random.random() > 0.5:
                status_update = CropStatusUpdate(status=CropStatus.HARVESTED)
                crud.crop.update_status(
                    db,
                    crop_id=crop.id,
                    obj_in=status_update
                )
        
        print("테스트 데이터가 성공적으로 생성되었습니다.")
        print(f"농부 로그인 정보: email={farmer_in.email}, password={farmer_in.password}")
        
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(create_test_data()) 