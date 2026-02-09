from typing import List, Optional
from pydantic import BaseModel

class InventoryItemCreate(BaseModel):
    name: str
    category: str
    quantity: int
    condition: str
    room_id: Optional[int] = None

class InventoryItem(InventoryItemCreate):
    id: int
    class Config:
        from_attributes = True

class StaffMemberCreate(BaseModel):
    name: str
    role: str
    contact: str
    shift: str
    assigned_area: str

class StaffMember(StaffMemberCreate):
    id: int
    is_active: bool
    class Config:
        from_attributes = True
