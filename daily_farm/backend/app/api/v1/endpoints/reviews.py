from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models
from app.api import deps
from app.schemas.review import Review, ReviewCreate, ReviewUpdate

router = APIRouter()

@router.post("/", response_model=Review)
def create_review(
    *,
    db: Session = Depends(deps.get_db),
    review_in: ReviewCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    리뷰를 생성합니다.
    """
    try:
        review = crud.review.create_with_user(
            db, obj_in=review_in, user_id=current_user.id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return review

@router.get("/me", response_model=List[Review])
def get_my_reviews(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    현재 사용자의 리뷰 목록을 조회합니다.
    """
    reviews = crud.review.get_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return reviews

@router.get("/crop/{crop_id}", response_model=List[Review])
def get_crop_reviews(
    *,
    db: Session = Depends(deps.get_db),
    crop_id: int,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    특정 작물의 리뷰 목록을 조회합니다.
    """
    reviews = crud.review.get_by_crop(
        db, crop_id=crop_id, skip=skip, limit=limit
    )
    return reviews

@router.get("/{review_id}", response_model=Review)
def get_review(
    *,
    db: Session = Depends(deps.get_db),
    review_id: int,
) -> Any:
    """
    리뷰 상세 정보를 조회합니다.
    """
    review = crud.review.get_review_with_details(db, review_id=review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.put("/{review_id}", response_model=Review)
def update_review(
    *,
    db: Session = Depends(deps.get_db),
    review_id: int,
    review_in: ReviewUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    리뷰를 수정합니다.
    """
    review = crud.review.get(db, id=review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    review = crud.review.update(db, db_obj=review, obj_in=review_in)
    return review

@router.delete("/{review_id}", response_model=Review)
def delete_review(
    *,
    db: Session = Depends(deps.get_db),
    review_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    리뷰를 삭제합니다.
    """
    review = crud.review.get(db, id=review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    review = crud.review.remove(db, id=review_id)
    return review 