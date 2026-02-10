from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.api import deps
from app.db.postgres import get_db
from app.models.hr import LeaveApplication
from app.models.user import User, Role
from app.schemas.hr import LeaveCreate, LeaveApplication as LeaveSchema, UserCreateRequest
from app.core.security import get_password_hash
from app.schemas.user import User as UserSchema

router = APIRouter()

# --- User Management (Admin) ---
@router.post("/users", response_model=UserSchema)
async def create_user_admin(
    user_in: UserCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    # Find role
    result = await db.execute(select(Role).where(Role.name == user_in.role_name))
    role = result.scalars().first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role")

    # Check email
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role_id=role.id,
        is_active=True
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

# --- Leave Management ---
@router.post("/leave", response_model=LeaveSchema)
async def apply_leave(
    leave_in: LeaveCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    leave = LeaveApplication(
        **leave_in.model_dump(),
        user_id=current_user.id
    )
    db.add(leave)
    await db.commit()
    await db.refresh(leave)
    return leave

@router.get("/leave/pending", response_model=List[LeaveSchema])
async def list_pending_leaves(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    result = await db.execute(select(LeaveApplication).where(LeaveApplication.status == "Pending"))
    return result.scalars().all()

@router.put("/leave/{id}/approve")
async def approve_leave(
    id: int,
    status: str, # Approved, Rejected
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    leave = await db.get(LeaveApplication, id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    leave.status = status
    await db.commit()
    return {"status": "success"}
