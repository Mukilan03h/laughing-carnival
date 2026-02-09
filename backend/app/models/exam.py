from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.postgres import Base

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # e.g., "Mid Term 2023"
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    date = Column(DateTime)
    total_marks = Column(Integer)

    subject = relationship("Subject")

class ExamResult(Base):
    __tablename__ = "exam_results"
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    marks_obtained = Column(Float)
    remarks = Column(String, nullable=True)

    exam = relationship("Exam")
    student = relationship("User")
