from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.postgres import Base

class MealType(str, enum.Enum):
    BREAKFAST = "Breakfast"
    LUNCH = "Lunch"
    SNACK = "Snack"
    DINNER = "Dinner"

class MessMenu(Base):
    __tablename__ = "mess_menus"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime)
    meal_type = Column(String)  # MealType enum
    items = Column(String) # JSON or Comma Separated String
    price = Column(Float)

class MessAttendance(Base):
    __tablename__ = "mess_attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    meal_type = Column(String)
    consumed = Column(Boolean, default=True)

    student = relationship("User")

class MessBill(Base):
    __tablename__ = "mess_bills"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    month = Column(String) # e.g., "2023-10"
    total_meals = Column(Integer)
    total_amount = Column(Float)
    generated_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User")
