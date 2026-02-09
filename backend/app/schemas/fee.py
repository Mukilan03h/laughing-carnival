from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class FeeStructureBase(BaseModel):
    name: str
    academic_year: str
    total_amount: float
    description: Optional[str] = None

class FeeStructureCreate(FeeStructureBase):
    pass

class FeeStructure(FeeStructureBase):
    id: int

    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    student_id: int
    fee_structure_id: int
    amount_due: float
    due_date: datetime

class InvoiceCreate(InvoiceBase):
    pass

class Invoice(InvoiceBase):
    id: int
    invoice_number: str
    amount_paid: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    invoice_id: int
    amount: float
    payment_method: str
    reference_id: Optional[str] = None

class Transaction(TransactionCreate):
    id: int
    transaction_date: datetime

    class Config:
        from_attributes = True
