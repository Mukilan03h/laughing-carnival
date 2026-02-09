from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.api import deps
from app.db.postgres import get_db
from app.models.academic import Course, Attendance
from app.models.user import User
from app.schemas.academic import CourseCreate, Course as CourseSchema, AttendanceCreate, Attendance as AttendanceSchema

router = APIRouter()

@router.post("/courses", response_model=CourseSchema)
async def create_course(
    course_in: CourseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    course = Course(**course_in.model_dump())
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course

@router.get("/courses", response_model=List[CourseSchema])
async def list_courses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Course))
    return result.scalars().all()

@router.post("/attendance", response_model=AttendanceSchema)
async def mark_attendance(
    attendance_in: AttendanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser) # Faculty
):
    attendance = Attendance(**attendance_in.model_dump())
    db.add(attendance)
    await db.commit()
    await db.refresh(attendance)
    return attendance

@router.get("/attendance/my", response_model=List[AttendanceSchema])
async def my_attendance(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Attendance).where(Attendance.student_id == current_user.id))
    return result.scalars().all()
