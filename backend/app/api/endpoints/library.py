from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.api import deps
from app.db.postgres import get_db
from app.models.library import Book, BookIssue
from app.models.user import User
from app.schemas.library import BookCreate, Book as BookSchema, IssueBook, BookIssue as BookIssueSchema

router = APIRouter()

@router.post("/books", response_model=BookSchema)
async def add_book(
    book_in: BookCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    book = Book(
        **book_in.model_dump(),
        available_copies=book_in.total_copies
    )
    db.add(book)
    await db.commit()
    await db.refresh(book)
    return book

@router.get("/books", response_model=List[BookSchema])
async def list_books(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Book))
    return result.scalars().all()

@router.post("/issue", response_model=BookIssueSchema)
async def issue_book(
    issue_in: IssueBook,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    book = await db.get(Book, issue_in.book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.available_copies < 1:
        raise HTTPException(status_code=400, detail="No copies available")

    issue = BookIssue(
        **issue_in.model_dump(),
        issue_date=datetime.utcnow()
    )
    book.available_copies -= 1
    db.add(issue)
    await db.commit()
    await db.refresh(issue)
    return issue

@router.post("/return/{issue_id}", response_model=BookIssueSchema)
async def return_book(
    issue_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    issue = await db.get(BookIssue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue record not found")

    issue.return_date = datetime.utcnow()
    # Calculate fine logic here (mock)
    if issue.return_date > issue.due_date:
        issue.fine_amount = 50

    # Restore book copy
    book = await db.get(Book, issue.book_id)
    book.available_copies += 1

    await db.commit()
    await db.refresh(issue)
    return issue
