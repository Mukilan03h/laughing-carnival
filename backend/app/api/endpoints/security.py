from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.api import deps
from app.db.postgres import get_db
from app.models.security import Visitor, GatePass
from app.models.user import User
from app.schemas.security import VisitorCreate, Visitor as VisitorSchema, GatePassCreate, GatePass as GatePassSchema
from app.services.pdf_generator import generate_gatepass_pdf

router = APIRouter()

# --- Visitor Management ---
@router.post("/visitors/entry", response_model=VisitorSchema)
async def record_visitor_entry(
    visitor_in: VisitorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    visitor = Visitor(
        **visitor_in.model_dump(),
        entry_time=datetime.utcnow()
    )
    db.add(visitor)
    await db.commit()
    await db.refresh(visitor)
    return visitor

@router.put("/visitors/exit/{visitor_id}", response_model=VisitorSchema)
async def record_visitor_exit(
    visitor_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    visitor = await db.get(Visitor, visitor_id)
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    visitor.exit_time = datetime.utcnow()
    await db.commit()
    await db.refresh(visitor)
    return visitor

@router.get("/visitors", response_model=List[VisitorSchema])
async def list_visitors(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_superuser)
):
    result = await db.execute(select(Visitor))
    return result.scalars().all()

# --- Gate Pass ---
@router.post("/gatepass/request", response_model=GatePassSchema)
async def request_gate_pass(
    gatepass_in: GatePassCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    gatepass = GatePass(
        **gatepass_in.model_dump(),
        student_id=current_user.id,
        status="Pending"
    )
    db.add(gatepass)
    await db.commit()
    await db.refresh(gatepass)
    return gatepass

@router.put("/gatepass/approve/{gatepass_id}", response_model=GatePassSchema)
async def approve_gate_pass(
    gatepass_id: int,
    status: str, # Approved, Rejected
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # RBAC: Warden or Admin only
    if not current_user.is_superuser and (not current_user.role or current_user.role.name != "warden"):
         raise HTTPException(status_code=403, detail="Not authorized")

    gatepass = await db.get(GatePass, gatepass_id)
    if not gatepass:
        raise HTTPException(status_code=404, detail="Gate pass not found")

    gatepass.status = status
    gatepass.approved_by = current_user.id
    await db.commit()
    await db.refresh(gatepass)
    return gatepass

@router.get("/gatepass/my", response_model=List[GatePassSchema])
async def list_my_gate_passes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(GatePass).where(GatePass.student_id == current_user.id))
    return result.scalars().all()

@router.get("/gatepass/pending", response_model=List[GatePassSchema])
async def list_pending_gate_passes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # RBAC: Warden or Admin only
    if not current_user.is_superuser and (not current_user.role or current_user.role.name != "warden"):
         raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(select(GatePass).where(GatePass.status == "Pending"))
    return result.scalars().all()

@router.get("/gatepass/{id}/pdf")
async def get_gatepass_pdf(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    gatepass = await db.get(GatePass, id)
    if not gatepass:
        raise HTTPException(status_code=404, detail="Gate pass not found")

    if not current_user.is_superuser and gatepass.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    data = {
        "id": gatepass.id,
        "reason": gatepass.reason,
        "departure_time": str(gatepass.departure_time),
        "expected_return": str(gatepass.expected_return),
        "status": gatepass.status,
    }

    pdf_buffer = generate_gatepass_pdf(data)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=gatepass_{gatepass.id}.pdf"}
    )
