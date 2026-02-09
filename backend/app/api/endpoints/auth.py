from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import User as UserSchema

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await authenticate(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=400, detail="Incorrect email or password"
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

# Helper
async def authenticate(db: AsyncSession, email: str, password: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user
