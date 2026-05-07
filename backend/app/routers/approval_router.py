from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.approval_model import Approval
from app.models.approval_history_model import ApprovalHistory
from app.schemas.approval_schema import ApprovalCreate, ApprovalAction
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/approvals", tags=["Approvals"])


# ✅ CREATE (Employee only)
@router.post("/")
def create_approval(
    data: ApprovalCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can request")

    approval = Approval(
        title=data.title,
        description=data.description,
        requested_by=current_user.id,
        status="pending",
        current_level="manager"  # still stored (optional)
    )

    db.add(approval)
    db.commit()
    db.refresh(approval)

    return approval


# ✅ GET
@router.get("/")
def get_approvals(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role == "employee":
        return db.query(Approval).filter(
            Approval.requested_by == current_user.id
        ).all()

    return db.query(Approval).all()


# 🔥 FIXED APPROVE / REJECT (SIMPLE)
@router.patch("/{approval_id}/action")
def approval_action(
    approval_id: int,
    data: ApprovalAction,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    approval = db.query(Approval).filter(Approval.id == approval_id).first()

    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")

    if approval.status in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Already completed")

    action = data.action.lower()

    # ❗ Only manager/admin
    if current_user.role not in ["manager", "admin"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    # ❗ Reject needs comment
    if action == "rejected" and not data.comment:
        raise HTTPException(status_code=400, detail="Comment required")

    # 🔥 SIMPLE LOGIC (FIX)
    if action == "approved":
        approval.status = "approved"

    elif action == "rejected":
        approval.status = "rejected"

    # ✅ SAVE HISTORY
    history = ApprovalHistory(
        approval_id=approval.id,
        action_by=current_user.id,
        action=action,
        comment=data.comment
    )

    db.add(history)
    db.commit()
    db.refresh(approval)

    return approval


# ✅ HISTORY
@router.get("/{approval_id}/history")
def get_history(
    approval_id: int,
    db: Session = Depends(get_db)
):
    return db.query(ApprovalHistory).filter(
        ApprovalHistory.approval_id == approval_id
    ).all()