from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class LeaveCreate(BaseModel):
    leave_type: str
    start_date: datetime
    end_date: datetime
    reason: str

class LeaveApplication(LeaveCreate):
    id: int
    user_id: int
    status: str
    class Config:
        from_attributes = True

class UserCreateRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role_name: str # student, faculty, warden
