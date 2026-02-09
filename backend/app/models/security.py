from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.postgres import Base

class Visitor(Base):
    __tablename__ = "visitors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    contact = Column(String)
    purpose = Column(String)
    student_id = Column(Integer, ForeignKey("users.id"))
    entry_time = Column(DateTime, default=datetime.utcnow)
    exit_time = Column(DateTime, nullable=True)

    student = relationship("User")

class GatePass(Base):
    __tablename__ = "gate_passes"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    reason = Column(String)
    departure_time = Column(DateTime)
    expected_return = Column(DateTime)
    status = Column(String, default="Pending") # Pending, Approved, Rejected, Completed
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    student = relationship("User", foreign_keys=[student_id])
    approver = relationship("User", foreign_keys=[approved_by])
