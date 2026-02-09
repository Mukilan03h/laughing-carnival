from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.postgres import Base

class PaymentStatus(str, enum.Enum):
    PENDING = "Pending"
    PARTIAL = "Partial"
    PAID = "Paid"
    OVERDUE = "Overdue"

class FeeStructure(Base):
    __tablename__ = "fee_structures"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)  # e.g., "B.Tech 1st Year Hostel Fee"
    academic_year = Column(String)
    total_amount = Column(Float)
    description = Column(String, nullable=True)

    invoices = relationship("Invoice", back_populates="fee_structure")

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    fee_structure_id = Column(Integer, ForeignKey("fee_structures.id"))
    amount_due = Column(Float)
    amount_paid = Column(Float, default=0.0)
    due_date = Column(DateTime)
    status = Column(String, default=PaymentStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User")
    fee_structure = relationship("FeeStructure", back_populates="invoices")
    transactions = relationship("Transaction", back_populates="invoice")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    amount = Column(Float)
    transaction_date = Column(DateTime, default=datetime.utcnow)
    payment_method = Column(String) # Cash, Online, Cheque
    reference_id = Column(String, nullable=True)

    invoice = relationship("Invoice", back_populates="transactions")
