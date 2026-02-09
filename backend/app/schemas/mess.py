from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class MessMenuCreate(BaseModel):
    date: datetime
    meal_type: str
    items: str
    price: float

class MessMenu(MessMenuCreate):
    id: int

    class Config:
        from_attributes = True

class MessAttendanceCreate(BaseModel):
    student_id: int
    meal_type: str

class MessAttendance(MessAttendanceCreate):
    id: int
    date: datetime
    consumed: bool

    class Config:
        from_attributes = True

class MessBill(BaseModel):
    id: int
    student_id: int
    month: str
    total_meals: int
    total_amount: float
    generated_at: datetime

    class Config:
        from_attributes = True
