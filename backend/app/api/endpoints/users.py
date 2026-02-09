from typing import Any, List, Dict
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.api import deps
from app.core import security
from app.models.user import User, Role
from app.models.hostel import Room, Bed, Allocation
from app.models.fee import Invoice, PaymentStatus
from app.models.academic import Attendance
from app.models.library import BookIssue
from app.schemas.user import UserCreate, User as UserSchema

router = APIRouter()

@router.post("/", response_model=UserSchema)
async def create_user(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_superuser=user_in.is_superuser,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.get("/me", response_model=UserSchema)
async def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.get("/", response_model=List[UserSchema])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_superuser),
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    Retrieve users.
    """
    result = await db.execute(select(User).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/dashboard", response_model=Dict[str, Any])
async def get_dashboard_stats(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get aggregated dashboard stats based on user role.
    """

    # Needs explicit loading of role to check name, or query role table
    # Since User model has relationship but it might not be loaded:
    # We can rely on is_superuser for admin

    stats = {}

    if current_user.is_superuser:
        # Admin Stats
        student_count = await db.execute(select(func.count(User.id)).where(User.is_superuser == False))
        room_count = await db.execute(select(func.count(Room.id)))
        pending_fees = await db.execute(select(func.sum(Invoice.amount_due - Invoice.amount_paid)).where(Invoice.status != PaymentStatus.PAID))

        stats = {
            "role": "admin",
            "total_students": student_count.scalar() or 0,
            "total_rooms": room_count.scalar() or 0,
            "pending_fees": pending_fees.scalar() or 0.0
        }
    else:
        # Assuming Student Role if not superuser for now (simplified)
        # In real app check current_user.role.name

        # Student Stats
        my_invoices = await db.execute(select(Invoice).where(Invoice.student_id == current_user.id))
        invoices = my_invoices.scalars().all()
        due_amount = sum(inv.amount_due - inv.amount_paid for inv in invoices)

        my_allocation = await db.execute(select(Allocation).where(Allocation.student_id == current_user.id, Allocation.is_active == True))
        allocation = my_allocation.scalars().first()

        my_books = await db.execute(select(func.count(BookIssue.id)).where(BookIssue.student_id == current_user.id, BookIssue.return_date == None))

        stats = {
            "role": "student",
            "fee_due": due_amount,
            "hostel_allocated": bool(allocation),
            "books_issued": my_books.scalar() or 0
        }

    return stats
