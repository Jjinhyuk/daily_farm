from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models
from app.api import deps
from app.schemas.message import Message, MessageCreate, MessageUpdate

router = APIRouter()

@router.post("/", response_model=Message)
def create_message(
    *,
    db: Session = Depends(deps.get_db),
    message_in: MessageCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    새로운 메시지를 생성합니다.
    """
    # 받는 사람이 존재하는지 확인
    receiver = crud.user.get(db, id=message_in.receiver_id)
    if not receiver:
        raise HTTPException(
            status_code=404,
            detail="Receiver not found"
        )
    
    message = crud.message.create_with_sender(
        db=db,
        obj_in=message_in,
        sender_id=current_user.id
    )
    return message

@router.get("/", response_model=List[Message])
def get_messages(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    현재 사용자의 메시지 목록을 조회합니다.
    """
    messages = crud.message.get_messages(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )
    return messages

@router.get("/unread-count", response_model=int)
def get_unread_count(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    읽지 않은 메시지 수를 반환합니다.
    """
    return crud.message.get_unread_count(db=db, user_id=current_user.id)

@router.get("/{message_id}", response_model=Message)
def get_message(
    *,
    db: Session = Depends(deps.get_db),
    message_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    메시지 상세 정보를 조회합니다.
    """
    message = crud.message.get_message_with_details(db=db, message_id=message_id)
    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found"
        )
    
    # 권한 확인
    if message["sender"]["id"] != current_user.id and message["receiver"]["id"] != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # 받은 메시지인 경우 읽음 처리
    if message["receiver"]["id"] == current_user.id and not message["is_read"]:
        crud.message.mark_as_read(
            db=db,
            message_id=message_id,
            user_id=current_user.id
        )
    
    return message 