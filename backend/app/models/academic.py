from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.postgres import Base

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    code = Column(String, unique=True)
    department = Column(String)

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    code = Column(String, unique=True)
    course_id = Column(Integer, ForeignKey("courses.id"))

    course = relationship("Course")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    date = Column(DateTime)
    status = Column(String) # Present, Absent

    student = relationship("User")
    subject = relationship("Subject")
