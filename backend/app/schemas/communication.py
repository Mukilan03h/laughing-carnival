from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class NoticeCreate(BaseModel):
    title: str
    content: str
    priority: str = "Low"
    expires_at: Optional[datetime] = None

class Notice(NoticeCreate):
    id: int
    created_at: datetime
    author_id: int

    class Config:
        from_attributes = True

class Notification(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
