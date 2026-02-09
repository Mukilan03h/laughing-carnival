from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.db.postgres import get_db
from app.models.inventory import InventoryItem
from app.models.staff import StaffMember
from app.models.user import User
from app.schemas.hostel_ops import InventoryItemCreate, InventoryItem as InventoryItemSchema, StaffMemberCreate, StaffMember as StaffMemberSchema

router = APIRouter()

# --- Inventory ---
@router.post("/inventory", response_model=InventoryItemSchema)
async def add_inventory_item(
    item_in: InventoryItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    item = InventoryItem(**item_in.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item

@router.get("/inventory", response_model=List[InventoryItemSchema])
async def list_inventory(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    result = await db.execute(select(InventoryItem))
    return result.scalars().all()

# --- Staff ---
@router.post("/staff", response_model=StaffMemberSchema)
async def add_staff_member(
    staff_in: StaffMemberCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    staff = StaffMember(**staff_in.model_dump())
    db.add(staff)
    await db.commit()
    await db.refresh(staff)
    return staff

@router.get("/staff", response_model=List[StaffMemberSchema])
async def list_staff(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    result = await db.execute(select(StaffMember))
    return result.scalars().all()
