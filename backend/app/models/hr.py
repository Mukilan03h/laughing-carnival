from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.postgres import Base

class LeaveApplication(Base):
    __tablename__ = "leave_applications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    leave_type = Column(String) # Sick, Casual, Earned
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    reason = Column(String)
    status = Column(String, default="Pending") # Pending, Approved, Rejected

    user = relationship("User")

class Payroll(Base):
    __tablename__ = "payrolls"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    month = Column(String) # 2023-10
    basic_salary = Column(Float)
    deductions = Column(Float)
    net_salary = Column(Float)
    status = Column(String) # Processed, Paid

    user = relationship("User")
