from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app import crud, models
from app.api import deps
from app.utils.s3 import s3_client
from app.schemas.crop import (
    Crop,
    CropCreate,
    CropUpdate,
    CropStatusUpdate,
    CropSensorUpdate
)

router = APIRouter()

@router.get("/", response_model=List[Crop])
def get_crops(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Optional[models.User] = Depends(deps.get_current_user_optional)
) -> Any:
    """
    모든 작물 목록을 조회합니다.
    """
    if current_user and current_user.user_type == models.user.UserType.FARMER:
        crops = crud.crop.get_multi_by_farmer(
            db, farmer_id=current_user.id, skip=skip, limit=limit
        )
    else:
        crops = crud.crop.get_multi(db, skip=skip, limit=limit)
    return crops

@router.get("/available", response_model=List[Crop])
def get_available_crops(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    구매 가능한 작물 목록을 조회합니다.
    """
    crops = crud.crop.get_available_crops(db, skip=skip, limit=limit)
    return crops

@router.post("/", response_model=Crop)
def create_crop(
    *,
    db: Session = Depends(deps.get_db),
    crop_in: CropCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    새로운 작물을 등록합니다.
    """
    if current_user.user_type != models.user.UserType.FARMER:
        raise HTTPException(
            status_code=403,
            detail="Only farmers can create crops"
        )
    crop = crud.crop.create_with_farmer(
        db=db, obj_in=crop_in, farmer_id=current_user.id
    )
    return crop

@router.get("/{id}", response_model=Crop)
def get_crop(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    작물 상세 정보를 조회합니다.
    """
    crop = crud.crop.get_with_details(db=db, id=id)
    if not crop:
        raise HTTPException(
            status_code=404,
            detail="Crop not found"
        )
    return crop

@router.put("/{id}", response_model=Crop)
def update_crop(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    crop_in: CropUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    작물 정보를 수정합니다.
    """
    crop = crud.crop.get(db=db, id=id)
    if not crop:
        raise HTTPException(
            status_code=404,
            detail="Crop not found"
        )
    if crop.farmer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    crop = crud.crop.update(db=db, db_obj=crop, obj_in=crop_in)
    return crop

@router.post("/{id}/images")
async def upload_crop_images(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    files: List[UploadFile] = File(...),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    작물 이미지를 업로드합니다.
    """
    crop = crud.crop.get(db=db, id=id)
    if not crop:
        raise HTTPException(
            status_code=404,
            detail="Crop not found"
        )
    if crop.farmer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )

    image_urls = []
    for file in files:
        image_url = await s3_client.upload_image(file, folder="crops")
        if image_url:
            image_urls.append(image_url)

    if image_urls:
        crop = crud.crop.update(
            db=db,
            db_obj=crop,
            obj_in={"images": crop.images + image_urls}
        )
        return {"message": "Images uploaded successfully", "urls": image_urls}
    else:
        raise HTTPException(
            status_code=400,
            detail="Failed to upload images"
        )

@router.delete("/{id}/images/{index}")
def delete_crop_image(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    index: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    작물 이미지를 삭제합니다.
    """
    crop = crud.crop.get(db=db, id=id)
    if not crop:
        raise HTTPException(
            status_code=404,
            detail="Crop not found"
        )
    if crop.farmer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )

    if 0 <= index < len(crop.images):
        image_url = crop.images[index]
        if s3_client.delete_image(image_url):
            new_images = crop.images.copy()
            new_images.pop(index)
            crop = crud.crop.update(
                db=db,
                db_obj=crop,
                obj_in={"images": new_images}
            )
            return {"message": "Image deleted successfully"}
    
    raise HTTPException(
        status_code=400,
        detail="Failed to delete image"
    )

@router.put("/{id}/sensor", response_model=Crop)
def update_crop_sensor_data(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    sensor_data: CropSensorUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    작물의 센서 데이터를 업데이트합니다.
    """
    crop = crud.crop.get(db=db, id=id)
    if not crop:
        raise HTTPException(
            status_code=404,
            detail="Crop not found"
        )
    if crop.farmer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    crop = crud.crop.update_sensor_data(
        db=db,
        crop_id=id,
        obj_in=sensor_data
    )
    return crop

@router.put("/{id}/status", response_model=Crop)
def update_crop_status(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    status_update: CropStatusUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    작물의 상태를 업데이트합니다.
    """
    crop = crud.crop.get(db=db, id=id)
    if not crop:
        raise HTTPException(
            status_code=404,
            detail="Crop not found"
        )
    if crop.farmer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    crop = crud.crop.update_status(
        db=db,
        crop_id=id,
        obj_in=status_update
    )
    return crop 