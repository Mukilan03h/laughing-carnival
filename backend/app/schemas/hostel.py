from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class BedBase(BaseModel):
    bed_number: str
    is_occupied: bool = False

class BedCreate(BedBase):
    pass

class Bed(BedBase):
    id: int
    room_id: int

    class Config:
        from_attributes = True

class RoomBase(BaseModel):
    room_number: str
    capacity: int
    floor: int
    type: str
    rent: float

class RoomCreate(RoomBase):
    hostel_id: int

class Room(RoomBase):
    id: int
    hostel_id: int
    beds: List[Bed] = []

    class Config:
        from_attributes = True

class AllocationBase(BaseModel):
    student_id: int
    bed_id: int
    start_date: Optional[datetime] = None

class AllocationCreate(AllocationBase):
    pass

class Allocation(AllocationBase):
    id: int
    is_active: bool
    end_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str
    priority: str = "Medium"

class Complaint(ComplaintCreate):
    id: str
    student_id: int
    status: str
    created_at: datetime
    attachments: List[str] = []
