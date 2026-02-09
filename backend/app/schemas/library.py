from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class BookCreate(BaseModel):
    title: str
    author: str
    isbn: str
    total_copies: int

class Book(BookCreate):
    id: int
    available_copies: int
    class Config:
        from_attributes = True

class IssueBook(BaseModel):
    book_id: int
    student_id: int
    due_date: datetime

class BookIssue(IssueBook):
    id: int
    issue_date: datetime
    return_date: Optional[datetime] = None
    fine_amount: int
    class Config:
        from_attributes = True
