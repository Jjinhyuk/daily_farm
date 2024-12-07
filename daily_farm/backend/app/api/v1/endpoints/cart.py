from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models
from app.api import deps
from app.schemas.cart import Cart, CartItemCreate, CartItemUpdate

router = APIRouter()

@router.get("/", response_model=Cart)
def get_cart(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    현재 사용자의 장바구니를 조회합니다.
    """
    cart = crud.cart.get_by_user(db, user_id=current_user.id)
    if not cart:
        cart = crud.cart.get_or_create(db, user_id=current_user.id)
    
    cart_data = crud.cart.get_cart_with_items(db, cart_id=cart.id)
    if not cart_data:
        raise HTTPException(status_code=404, detail="Cart not found")
    return cart_data

@router.post("/items", response_model=Dict[str, Any])
def add_cart_item(
    *,
    db: Session = Depends(deps.get_db),
    item_in: CartItemCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    장바구니에 상품을 추가합니다.
    """
    # 작물 존재 여부 확인
    crop = crud.crop.get(db, id=item_in.crop_id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    # 재고 확인
    if crop.quantity_available < item_in.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
    
    # 장바구니 가져오기 또는 생성
    cart = crud.cart.get_by_user(db, user_id=current_user.id)
    if not cart:
        cart = crud.cart.get_or_create(db, user_id=current_user.id)
    
    # 이미 장바구니에 있는 상품인지 확인
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.cart_id == cart.id,
        models.CartItem.crop_id == item_in.crop_id
    ).first()
    
    if existing_item:
        # 기존 수량에 추가
        new_quantity = existing_item.quantity + item_in.quantity
        if new_quantity > crop.quantity_available:
            raise HTTPException(status_code=400, detail="Not enough stock")
        
        item = crud.cart.update_item(
            db,
            cart_id=cart.id,
            item_id=existing_item.id,
            item_in=CartItemUpdate(quantity=new_quantity)
        )
    else:
        # 새 아이템 추가
        item = crud.cart.add_item(db, cart_id=cart.id, item_in=item_in)
    
    # 업데이트된 장바구니 정보 반환
    cart_data = crud.cart.get_cart_with_items(db, cart_id=cart.id)
    return {
        "message": "Item added to cart successfully",
        "cart": cart_data
    }

@router.put("/items/{item_id}", response_model=Dict[str, Any])
def update_cart_item(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    item_in: CartItemUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    장바구니 상품의 수량을 수정합니다.
    """
    # 사용자의 장바구니 확인
    cart = crud.cart.get_by_user(db, user_id=current_user.id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # 장바구니 아이템 확인
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.cart_id == cart.id
    ).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    # 재고 확인
    crop = crud.crop.get(db, id=cart_item.crop_id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    if crop.quantity_available < item_in.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
    
    # 수량 업데이트
    item = crud.cart.update_item(db, cart_id=cart.id, item_id=item_id, item_in=item_in)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    # 업데이트된 장바구니 정보 반환
    cart_data = crud.cart.get_cart_with_items(db, cart_id=cart.id)
    return {
        "message": "Cart item updated successfully",
        "cart": cart_data
    }

@router.delete("/items/{item_id}", response_model=Dict[str, Any])
def remove_cart_item(
    *,
    db: Session = Depends(deps.get_db),
    item_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    장바구니에서 상품을 제거합니다.
    """
    # 사용자의 장바구니 확인
    cart = crud.cart.get_by_user(db, user_id=current_user.id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # 아이템 삭제
    success = crud.cart.remove_item(db, cart_id=cart.id, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    # 업데이트된 장바구니 정보 반환
    cart_data = crud.cart.get_cart_with_items(db, cart_id=cart.id)
    return {
        "message": "Cart item removed successfully",
        "cart": cart_data
    }

@router.delete("/", response_model=Dict[str, str])
def clear_cart(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    장바구니를 비웁니다.
    """
    cart = crud.cart.get_by_user(db, user_id=current_user.id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    crud.cart.clear_cart(db, cart_id=cart.id)
    return {"message": "Cart cleared successfully"} 