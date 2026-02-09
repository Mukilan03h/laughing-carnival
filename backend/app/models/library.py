from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.postgres import Base

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    isbn = Column(String, unique=True, index=True)
    total_copies = Column(Integer)
    available_copies = Column(Integer)

    issues = relationship("BookIssue", back_populates="book")

class BookIssue(Base):
    __tablename__ = "book_issues"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    issue_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime)
    return_date = Column(DateTime, nullable=True)
    fine_amount = Column(Integer, default=0)

    book = relationship("Book", back_populates="issues")
    student = relationship("User")
