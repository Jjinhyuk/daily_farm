from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.crud.base import CRUDBase
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageUpdate

class CRUDMessage(CRUDBase[Message, MessageCreate, MessageUpdate]):
    def create_with_sender(
        self, db: Session, *, obj_in: MessageCreate, sender_id: int
    ) -> Message:
        current_time = datetime.utcnow().isoformat()
        db_obj = Message(
            **obj_in.dict(),
            user_id=sender_id,
            is_read=False,
            created_at=current_time,
            updated_at=current_time
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_messages(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Message]:
        """사용자의 모든 메시지(보낸 메시지와 받은 메시지)를 조회합니다."""
        return (
            db.query(Message)
            .filter(
                or_(
                    Message.user_id == user_id,
                    Message.receiver_id == user_id
                )
            )
            .order_by(Message.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_unread_count(self, db: Session, *, user_id: int) -> int:
        """사용자의 읽지 않은 메시지 수를 반환합니다."""
        return (
            db.query(Message)
            .filter(
                and_(
                    Message.receiver_id == user_id,
                    Message.is_read == False
                )
            )
            .count()
        )

    def mark_as_read(
        self, db: Session, *, message_id: int, user_id: int
    ) -> Optional[Message]:
        """메시지를 읽음 상태로 표시합니다."""
        message = (
            db.query(Message)
            .filter(
                and_(
                    Message.id == message_id,
                    Message.receiver_id == user_id,
                    Message.is_read == False
                )
            )
            .first()
        )
        if message:
            message.is_read = True
            message.updated_at = datetime.utcnow().isoformat()
            db.commit()
            db.refresh(message)
        return message

    def get_message_with_details(
        self, db: Session, *, message_id: int
    ) -> Optional[Dict[str, Any]]:
        """메시지 상세 정보를 조회합니다."""
        message = db.query(Message).filter(Message.id == message_id).first()
        if not message:
            return None

        return {
            "id": message.id,
            "title": message.title,
            "content": message.content,
            "is_read": message.is_read,
            "created_at": message.created_at,
            "updated_at": message.updated_at,
            "sender": {
                "id": message.sender.id,
                "full_name": message.sender.full_name,
                "profile_image": message.sender.profile_image
            },
            "receiver": {
                "id": message.receiver.id,
                "full_name": message.receiver.full_name,
                "profile_image": message.receiver.profile_image
            }
        }

message = CRUDMessage(Message) 