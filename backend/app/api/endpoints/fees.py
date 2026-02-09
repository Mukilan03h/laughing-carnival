from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.api import deps
from app.db.postgres import get_db
from app.models.fee import FeeStructure, Invoice, Transaction, PaymentStatus
from app.models.user import User
from app.services.pdf_generator import generate_invoice_pdf

from app.schemas.fee import FeeStructureCreate, FeeStructure as FeeStructureSchema, InvoiceCreate, Invoice as InvoiceSchema, TransactionCreate, Transaction as TransactionSchema

router = APIRouter()

# --- Fee Structures ---
@router.post("/structures", response_model=FeeStructureSchema)
async def create_fee_structure(
    fee_in: FeeStructureCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    structure = FeeStructure(**fee_in.model_dump())
    db.add(structure)
    await db.commit()
    await db.refresh(structure)
    return structure

@router.get("/structures", response_model=List[FeeStructureSchema])
async def list_fee_structures(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(FeeStructure))
    return result.scalars().all()

# --- Invoices ---
@router.post("/invoices/generate", response_model=InvoiceSchema)
async def generate_invoice(
    invoice_in: InvoiceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    # Check duplicate
    # Generate Invoice Number
    inv_num = f"INV-{int(datetime.now().timestamp())}"

    invoice = Invoice(
        **invoice_in.model_dump(),
        invoice_number=inv_num,
        status=PaymentStatus.PENDING,
        amount_paid=0.0,
        created_at=datetime.utcnow()
    )
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)
    return invoice

@router.get("/invoices/my", response_model=List[InvoiceSchema])
async def list_my_invoices(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Invoice).where(Invoice.student_id == current_user.id))
    return result.scalars().all()

@router.get("/invoices/all", response_model=List[InvoiceSchema])
async def list_all_invoices(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    result = await db.execute(select(Invoice))
    return result.scalars().all()

@router.get("/invoices/{id}/pdf")
async def get_invoice_pdf(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Invoice).where(Invoice.id == id))
    invoice = result.scalars().first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if not current_user.is_superuser and invoice.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    data = {
        "invoice_number": invoice.invoice_number,
        "created_at": str(invoice.created_at),
        "status": invoice.status,
        "amount_due": invoice.amount_due,
        # "student_name": invoice.student.full_name # Need eager load
    }

    pdf_buffer = generate_invoice_pdf(data)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=invoice_{invoice.invoice_number}.pdf"}
    )


# --- Payments ---
@router.post("/pay", response_model=TransactionSchema)
async def record_payment(
    payment_in: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser) # Only admin records payment for now
):
    invoice = await db.get(Invoice, payment_in.invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    transaction = Transaction(
        **payment_in.model_dump(),
        transaction_date=datetime.utcnow()
    )
    db.add(transaction)

    # Update Invoice Status
    invoice.amount_paid += payment_in.amount
    if invoice.amount_paid >= invoice.amount_due:
        invoice.status = PaymentStatus.PAID
    elif invoice.amount_paid > 0:
        invoice.status = PaymentStatus.PARTIAL

    await db.commit()
    await db.refresh(transaction)
    return transaction

# --- Defaulters ---
@router.get("/defaulters", response_model=List[InvoiceSchema])
async def list_defaulters(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    # Find invoices where due_date < now and status != PAID
    now = datetime.utcnow()
    result = await db.execute(select(Invoice).where(
        Invoice.due_date < now,
        Invoice.status != PaymentStatus.PAID
    ))
    return result.scalars().all()
