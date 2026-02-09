from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class CourseCreate(BaseModel):
    name: str
    code: str
    department: str

class Course(CourseCreate):
    id: int
    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    student_id: int
    subject_id: int
    date: datetime
    status: str

class Attendance(AttendanceCreate):
    id: int
    class Config:
        from_attributes = True
