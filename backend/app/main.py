from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    from app.db.postgres import engine, Base
    from app.models.user import User  # noqa: F401
    from app.models.hostel import Hostel, Room, Bed, Allocation  # noqa: F401
    from app.models.fee import FeeStructure, Invoice, Transaction  # noqa: F401
    from app.models.mess import MessMenu, MessAttendance, MessBill  # noqa: F401
    from app.models.security import Visitor, GatePass  # noqa: F401
    from app.models.academic import Course, Subject, Attendance  # noqa: F401
    from app.models.library import Book, BookIssue  # noqa: F401
    from app.models.communication import Notice, Notification  # noqa: F401
    from app.models.inventory import InventoryItem  # noqa: F401
    from app.models.staff import StaffMember  # noqa: F401

    from app.db.init_db import init_db
    await init_db()

@app.get("/health")
def health_check():
    return {"status": "ok"}
