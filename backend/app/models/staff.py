from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.postgres import Base

class StaffMember(Base):
    __tablename__ = "staff_members"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String) # Cleaner, Guard, Cook
    contact = Column(String)
    shift = Column(String) # Morning, Evening, Night
    assigned_area = Column(String)
    is_active = Column(Boolean, default=True)
