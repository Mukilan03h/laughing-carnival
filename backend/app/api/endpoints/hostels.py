from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

from app.api import deps
from app.db.postgres import get_db
from app.db.mongo import get_mongo_db
from app.services.storage import storage
from app.models.hostel import Hostel, Room, Bed, Allocation
from app.models.user import User
from app.schemas.hostel import RoomCreate, Room as RoomSchema, AllocationCreate, Allocation as AllocationSchema, ComplaintCreate, Complaint

router = APIRouter()

# --- Room Management ---
@router.post("/rooms", response_model=RoomSchema)
async def create_room(
    room_in: RoomCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    # Check if hostel exists (mock check for now as we don't have hostel CRUD yet)
    # Check if room number exists in hostel
    result = await db.execute(select(Room).where(Room.room_number == room_in.room_number))
    if result.scalars().first():
         raise HTTPException(status_code=400, detail="Room already exists")

    room = Room(**room_in.model_dump())
    db.add(room)
    await db.commit()
    await db.refresh(room)

    # Auto-create beds based on capacity
    for i in range(room.capacity):
        bed = Bed(bed_number=f"{room.room_number}-{chr(65+i)}", room_id=room.id)
        db.add(bed)
    await db.commit()

    # Reload room with beds
    result = await db.execute(select(Room).options(selectinload(Room.beds)).where(Room.id == room.id))
    return result.scalars().first()

@router.get("/rooms", response_model=List[RoomSchema])
async def list_rooms(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Room).options(selectinload(Room.beds)).offset(skip).limit(limit))
    return result.scalars().all()

# --- Allocation ---
@router.post("/allocate", response_model=AllocationSchema)
async def allocate_bed(
    allocation_in: AllocationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    # Check if bed exists and is free
    bed = await db.get(Bed, allocation_in.bed_id)
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")
    if bed.is_occupied:
        raise HTTPException(status_code=400, detail="Bed is already occupied")

    # Check if student exists
    student = await db.get(User, allocation_in.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    allocation = Allocation(**allocation_in.model_dump())
    db.add(allocation)

    # Update bed status
    bed.is_occupied = True

    await db.commit()
    await db.refresh(allocation)
    return allocation

# --- Complaints (Mongo + MinIO) ---
@router.post("/complaints", response_model=Complaint)
async def create_complaint(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    priority: str = Form("Medium"),
    files: List[UploadFile] = File(None),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: User = Depends(deps.get_current_user)
):
    attachment_urls = []
    if files:
        for file in files:
            # Upload to MinIO
            object_name = f"complaints/{current_user.id}/{datetime.now().timestamp()}_{file.filename}"
            url = storage.upload_file(file.file, object_name)
            if url:
                attachment_urls.append(url)

    complaint_doc = {
        "student_id": current_user.id,
        "title": title,
        "description": description,
        "category": category,
        "priority": priority,
        "status": "Open",
        "created_at": datetime.utcnow(),
        "attachments": attachment_urls
    }

    result = await db.complaints.insert_one(complaint_doc)
    complaint_doc["id"] = str(result.inserted_id)
    return complaint_doc

@router.get("/complaints", response_model=List[Complaint])
async def list_complaints(
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: User = Depends(deps.get_current_user)
):
    complaints = []
    cursor = db.complaints.find({"student_id": current_user.id}) # Filter for student
    # Admin should see all? For now just own.
    # If admin:
    if current_user.is_superuser:
        cursor = db.complaints.find()

    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        complaints.append(doc)
    return complaints
