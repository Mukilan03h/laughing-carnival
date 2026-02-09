from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ExamCreate(BaseModel):
    name: str
    subject_id: int
    date: datetime
    total_marks: int

class Exam(ExamCreate):
    id: int
    class Config:
        from_attributes = True

class ResultCreate(BaseModel):
    exam_id: int
    student_id: int
    marks_obtained: float
    remarks: Optional[str] = None

class ExamResult(ResultCreate):
    id: int
    class Config:
        from_attributes = True
