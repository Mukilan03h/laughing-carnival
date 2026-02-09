from fastapi import APIRouter
from app.api.endpoints import auth, users, hostels, fees, mess, security, academics, library

api_router = APIRouter()
api_router.include_router(auth.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(hostels.router, prefix="/hostels", tags=["hostels"])
api_router.include_router(fees.router, prefix="/fees", tags=["fees"])
api_router.include_router(mess.router, prefix="/mess", tags=["mess"])
api_router.include_router(security.router, prefix="/security", tags=["security"])
api_router.include_router(academics.router, prefix="/academics", tags=["academics"])
api_router.include_router(library.router, prefix="/library", tags=["library"])
