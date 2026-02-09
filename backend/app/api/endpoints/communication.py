from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.api import deps
from app.db.postgres import get_db
from app.models.communication import Notice, Notification
from app.models.user import User
from app.schemas.communication import NoticeCreate, Notice as NoticeSchema, Notification as NotificationSchema

router = APIRouter()

# --- Notices ---
@router.post("/notices", response_model=NoticeSchema)
async def create_notice(
    notice_in: NoticeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser) # Only admin/warden
):
    notice = Notice(
        **notice_in.model_dump(),
        author_id=current_user.id,
        created_at=datetime.utcnow()
    )
    db.add(notice)
    await db.commit()
    await db.refresh(notice)
    return notice

@router.get("/notices", response_model=List[NoticeSchema])
async def list_notices(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Notice).order_by(Notice.created_at.desc()))
    return result.scalars().all()

# --- Notifications ---
@router.get("/notifications", response_model=List[NotificationSchema])
async def list_my_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()))
    return result.scalars().all()

@router.put("/notifications/{id}/read")
async def mark_notification_read(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    notification = await db.get(Notification, id)
    if notification and notification.user_id == current_user.id:
        notification.is_read = True
        await db.commit()
    return {"status": "success"}

# Helper to create notification (internal use)
async def create_notification(db: AsyncSession, user_id: int, title: str, message: str, type: str = "Info"):
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        created_at=datetime.utcnow()
    )
    db.add(notif)
    # Commit should be handled by caller usually, but for simple triggers:
    # We might need to flush if part of larger transaction
    return notif
