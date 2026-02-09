from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.api import deps
from app.db.postgres import get_db
from app.models.exam import Exam, ExamResult
from app.models.user import User
from app.schemas.exam import ExamCreate, Exam as ExamSchema, ResultCreate, ExamResult as ExamResultSchema

router = APIRouter()

@router.post("/exams", response_model=ExamSchema)
async def schedule_exam(
    exam_in: ExamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser) # Or Faculty
):
    exam = Exam(**exam_in.model_dump())
    db.add(exam)
    await db.commit()
    await db.refresh(exam)
    return exam

@router.post("/results", response_model=ExamResultSchema)
async def publish_result(
    result_in: ResultCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser) # Or Faculty
):
    result = ExamResult(**result_in.model_dump())
    db.add(result)
    await db.commit()
    await db.refresh(result)
    return result

@router.get("/results/my", response_model=List[ExamResultSchema])
async def my_results(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(ExamResult).where(ExamResult.student_id == current_user.id))
    return result.scalars().all()

@router.get("/exams", response_model=List[ExamSchema])
async def list_exams(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser) # Or Faculty
):
    result = await db.execute(select(Exam))
    return result.scalars().all()
