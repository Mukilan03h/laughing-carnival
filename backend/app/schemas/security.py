from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class VisitorBase(BaseModel):
    name: str
    contact: str
    purpose: str
    student_id: int

class VisitorCreate(VisitorBase):
    pass

class Visitor(VisitorBase):
    id: int
    entry_time: datetime
    exit_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class GatePassCreate(BaseModel):
    reason: str
    departure_time: datetime
    expected_return: datetime

class GatePass(GatePassCreate):
    id: int
    student_id: int
    status: str
    approved_by: Optional[int] = None

    class Config:
        from_attributes = True
