from fastapi import APIRouter
from app.api.endpoints import auth, users, hostels, fees

api_router = APIRouter()
api_router.include_router(auth.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(hostels.router, prefix="/hostels", tags=["hostels"])
api_router.include_router(fees.router, prefix="/fees", tags=["fees"])
