from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.postgres import Base

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String) # Furniture, Electrical, etc.
    quantity = Column(Integer)
    condition = Column(String) # Good, Damaged, Repair Needed
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True) # Can be assigned to a room or general stock

    room = relationship("Room")
