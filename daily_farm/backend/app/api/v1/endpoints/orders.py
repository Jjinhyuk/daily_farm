from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models
from app.api import deps
from app.models.user import UserType
from app.models.order import OrderStatus
from app.schemas.order import Order, OrderCreate, OrderUpdate

router = APIRouter()

@router.post("/", response_model=Order)
def create_order(
    *,
    db: Session = Depends(deps.get_db),
    order_in: OrderCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    장바구니에서 주문을 생성합니다.
    """
    # 권한 확인
    if current_user.user_type != UserType.CUSTOMER:
        raise HTTPException(
            status_code=403,
            detail="Only customers can create orders"
        )
    
    # 주문 생성
    try:
        order = crud.order.create_with_items(db, obj_in=order_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # 주문 생성 후 장바구니 비우기
    cart = crud.cart.get_by_user(db, user_id=current_user.id)
    if cart:
        crud.cart.clear_cart(db, cart_id=cart.id)
    
    return order

@router.get("/me", response_model=List[Order])
def get_my_orders(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    현재 사용자의 주문 목록을 조회합니다.
    """
    if current_user.user_type == UserType.CUSTOMER:
        orders = crud.order.get_by_consumer(
            db, consumer_id=current_user.id, skip=skip, limit=limit
        )
    else:  # FARMER
        orders = crud.order.get_by_farmer(
            db, farmer_id=current_user.id, skip=skip, limit=limit
        )
    return orders

@router.get("/{order_id}", response_model=Order)
def get_order(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    주문 상세 정보를 조회합니다.
    """
    order = crud.order.get_order_with_details(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # 권한 확인
    if (current_user.user_type == UserType.CUSTOMER and order["consumer_id"] != current_user.id) or \
       (current_user.user_type == UserType.FARMER and order["farmer_id"] != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return order

@router.put("/{order_id}/status", response_model=Order)
def update_order_status(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    status_in: OrderUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    주문 상태를 업데이트합니다.
    """
    # 주문 조회
    order = crud.order.get(db, id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # 권한 확인
    if current_user.user_type != UserType.FARMER or order.farmer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # 상태 변경 가능 여부 확인
    if order.status == OrderStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Cannot update cancelled order")
    
    if status_in.status == OrderStatus.CANCELLED and order.status != OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Can only cancel pending orders")
    
    # 상태 업데이트
    order = crud.order.update_status(
        db,
        order_id=order_id,
        status=status_in.status,
        tracking_number=status_in.tracking_number
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

@router.post("/{order_id}/cancel", response_model=Order)
def cancel_order(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    주문을 취소합니다.
    """
    # 주문 조회
    order = crud.order.get(db, id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # 권한 확인
    if current_user.user_type == UserType.CUSTOMER:
        if order.consumer_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    else:  # FARMER
        if order.farmer_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # 취소 가능 여부 확인
    if order.status != OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Can only cancel pending orders")
    
    # 주문 취소
    order = crud.order.update_status(
        db,
        order_id=order_id,
        status=OrderStatus.CANCELLED
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order 