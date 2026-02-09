from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.postgres import Base

class Hostel(Base):
    __tablename__ = "hostels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    address = Column(String, nullable=True)

    rooms = relationship("Room", back_populates="hostel")

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, index=True)
    hostel_id = Column(Integer, ForeignKey("hostels.id"))
    capacity = Column(Integer)
    floor = Column(Integer)
    type = Column(String)  # e.g., 'AC', 'Non-AC'
    rent = Column(Float)

    hostel = relationship("Hostel", back_populates="rooms")
    beds = relationship("Bed", back_populates="room")

class Bed(Base):
    __tablename__ = "beds"
    id = Column(Integer, primary_key=True, index=True)
    bed_number = Column(String)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    is_occupied = Column(Boolean, default=False)

    room = relationship("Room", back_populates="beds")
    allocation = relationship("Allocation", back_populates="bed", uselist=False)

class Allocation(Base):
    __tablename__ = "allocations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))  # Assuming student is a User
    bed_id = Column(Integer, ForeignKey("beds.id"))
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

    bed = relationship("Bed", back_populates="allocation")
    student = relationship("User")
