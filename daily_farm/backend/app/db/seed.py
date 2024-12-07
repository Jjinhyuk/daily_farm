from datetime import datetime
from sqlalchemy.orm import Session
from ..core.database import SessionLocal
from ..models.user import User, UserType
from ..models.crop import Crop, CropStatus
from ..models.order import Order, OrderStatus
from ..models.message import Message

def create_seed_data():
    db = SessionLocal()
    try:
        # 사용자 데이터 생성
        farmers = [
            {
                "email": "farmer1@example.com",
                "hashed_password": "hashed_password_here",  # 실제로는 암호화된 비밀번호
                "full_name": "김농부",
                "user_type": UserType.FARMER,
                "farm_name": "행복한 농장",
                "farm_location": "경기도 파주시",
                "farm_description": "친환경 농법으로 재배하는 건강한 농장입니다.",
                "phone_number": "010-1234-5678",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            },
            {
                "email": "farmer2@example.com",
                "hashed_password": "hashed_password_here",
                "full_name": "이농부",
                "user_type": UserType.FARMER,
                "farm_name": "초록 농장",
                "farm_location": "강원도 춘천시",
                "farm_description": "20년 전통의 신선한 채소를 재배하는 농장입니다.",
                "phone_number": "010-2345-6789",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }
        ]

        consumers = [
            {
                "email": "consumer1@example.com",
                "hashed_password": "hashed_password_here",
                "full_name": "박소비",
                "user_type": UserType.CONSUMER,
                "phone_number": "010-3456-7890",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            },
            {
                "email": "consumer2@example.com",
                "hashed_password": "hashed_password_here",
                "full_name": "최소비",
                "user_type": UserType.CONSUMER,
                "phone_number": "010-4567-8901",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }
        ]

        partners = [
            {
                "email": "partner1@example.com",
                "hashed_password": "hashed_password_here",
                "full_name": "정파트너",
                "user_type": UserType.PARTNER,
                "company_name": "신선식품 주식회사",
                "business_type": "식품 가공 및 유통",
                "phone_number": "010-5678-9012",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }
        ]

        # 사용자 추가
        db_users = []
        for user_data in farmers + consumers + partners:
            db_user = User(**user_data)
            db.add(db_user)
            db_users.append(db_user)
        db.commit()

        # 작물 데이터 생성
        crops = [
            {
                "farmer_id": 1,  # 김농부의 작물
                "name": "방울토마토",
                "description": "당도 높은 유기농 방울토마토입니다.",
                "price_per_unit": 5000,
                "unit": "kg",
                "quantity_available": 100,
                "status": CropStatus.GROWING,
                "planting_date": "2024-01-01",
                "expected_harvest_date": "2024-02-15",
                "temperature": 25.5,
                "humidity": 65.0,
                "soil_ph": 6.5,
                "images": ["tomato1.jpg", "tomato2.jpg"],
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            },
            {
                "farmer_id": 1,
                "name": "상추",
                "description": "아삭아삭한 유기농 상추입니다.",
                "price_per_unit": 3000,
                "unit": "kg",
                "quantity_available": 50,
                "status": CropStatus.HARVESTED,
                "planting_date": "2024-01-05",
                "expected_harvest_date": "2024-02-01",
                "actual_harvest_date": "2024-02-01",
                "temperature": 22.0,
                "humidity": 70.0,
                "soil_ph": 6.8,
                "images": ["lettuce1.jpg", "lettuce2.jpg"],
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            },
            {
                "farmer_id": 2,  # 이농부의 작물
                "name": "당근",
                "description": "달콤한 당���입니다.",
                "price_per_unit": 4000,
                "unit": "kg",
                "quantity_available": 80,
                "status": CropStatus.GROWING,
                "planting_date": "2024-01-10",
                "expected_harvest_date": "2024-03-01",
                "temperature": 23.0,
                "humidity": 68.0,
                "soil_ph": 6.2,
                "images": ["carrot1.jpg", "carrot2.jpg"],
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }
        ]

        # 작물 추가
        db_crops = []
        for crop_data in crops:
            db_crop = Crop(**crop_data)
            db.add(db_crop)
            db_crops.append(db_crop)
        db.commit()

        # 주문 데이터 생성
        orders = [
            {
                "consumer_id": 3,  # 박소비의 주문
                "farmer_id": 1,    # 김농부에게
                "crop_id": 1,      # 방울토마토
                "quantity": 5,
                "total_price": 25000,
                "status": OrderStatus.CONFIRMED,
                "shipping_address": "서울시 강남구 테헤란로 123",
                "shipping_phone": "010-3456-7890",
                "tracking_number": "1234567890",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
                "confirmed_at": datetime.now().isoformat(),
                "payment_method": "card",
                "payment_status": "paid",
            },
            {
                "consumer_id": 4,  # 최소비의 주문
                "farmer_id": 2,    # 이농부에게
                "crop_id": 3,      # 당근
                "quantity": 3,
                "total_price": 12000,
                "status": OrderStatus.PENDING,
                "shipping_address": "서울시 서초구 서초대로 456",
                "shipping_phone": "010-4567-8901",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
                "payment_method": "card",
                "payment_status": "pending",
            }
        ]

        # 주문 추가
        db_orders = []
        for order_data in orders:
            db_order = Order(**order_data)
            db.add(db_order)
            db_orders.append(db_order)
        db.commit()

        # 메시지 데이터 생성
        messages = [
            {
                "sender_id": 3,    # 박소비가
                "receiver_id": 1,   # 김농부에게
                "content": "방울토마토 재배 과정이 궁금합니다.",
                "is_read": True,
                "crop_id": 1,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
                "read_at": datetime.now().isoformat(),
            },
            {
                "sender_id": 1,    # 김농부가
                "receiver_id": 3,   # 박소비에게
                "content": "네, 친환경 농법으로 정성껏 재배하고 있습니다.",
                "is_read": False,
                "crop_id": 1,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }
        ]

        # 메시지 추가
        for message_data in messages:
            db_message = Message(**message_data)
            db.add(db_message)
        db.commit()

        print("시드 데이터가 성공적으로 생성되었습니다!")

    except Exception as e:
        print(f"시드 데이터 생성 중 오류 발생: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_seed_data() 