from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.api import deps
from app.db.postgres import get_db
from app.models.mess import MessMenu, MessAttendance, MessBill
from app.models.user import User
from app.schemas.mess import MessMenuCreate, MessMenu as MessMenuSchema, MessAttendanceCreate, MessAttendance as MessAttendanceSchema, MessBill as MessBillSchema

router = APIRouter()

@router.post("/menu", response_model=MessMenuSchema)
async def create_mess_menu(
    menu_in: MessMenuCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    menu = MessMenu(**menu_in.model_dump())
    db.add(menu)
    await db.commit()
    await db.refresh(menu)
    return menu

@router.get("/menu", response_model=List[MessMenuSchema])
async def list_mess_menu(
    date: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    query = select(MessMenu)
    if date:
        query = query.where(MessMenu.date == date)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/attendance", response_model=MessAttendanceSchema)
async def mark_attendance(
    attendance_in: MessAttendanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    attendance = MessAttendance(
        student_id=attendance_in.student_id,
        meal_type=attendance_in.meal_type,
        date=datetime.utcnow()
    )
    db.add(attendance)
    await db.commit()
    await db.refresh(attendance)
    return attendance

@router.get("/bill", response_model=List[MessBillSchema])
async def generate_bill(
    student_id: int,
    month: str, # "2023-10"
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    # Calculate total meals
    # This logic would be more complex (filter by month, sum price from menus)
    # For now, simple mock calculation
    result = await db.execute(select(MessAttendance).where(MessAttendance.student_id == student_id))
    attendances = result.scalars().all()

    total_meals = len(attendances)
    total_amount = total_meals * 50.0 # Mock price per meal

    bill = MessBill(
        student_id=student_id,
        month=month,
        total_meals=total_meals,
        total_amount=total_amount,
        generated_at=datetime.utcnow()
    )
    # Don't save bill yet, just calculate? Usually save.
    db.add(bill)
    await db.commit()
    await db.refresh(bill)
    return [bill]
