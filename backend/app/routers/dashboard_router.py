from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task_model import Task
from app.models.approval_model import Approval
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# ✅ Dashboard Summary
@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 🔹 Role-based filtering
    if current_user.role == "admin":
        tasks = db.query(Task).all()
        approvals = db.query(Approval).all()

    elif current_user.role == "manager":
        tasks = db.query(Task).filter(
            Task.created_by_id == current_user.id
        ).all()
        approvals = db.query(Approval).all()

    else:  # employee
        tasks = db.query(Task).filter(
            Task.assigned_to_id == current_user.id
        ).all()
        approvals = db.query(Approval).filter(
            Approval.requested_by == current_user.id
        ).all()

    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t.status == "done"])
    in_progress = len([t for t in tasks if t.status == "in_progress"])
    pending_tasks = len([t for t in tasks if t.status in ["todo", "review"]])

    pending_approvals = len([a for a in approvals if a.status == "pending"])

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "in_progress": in_progress,
        "pending_tasks": pending_tasks,
        "pending_approvals": pending_approvals
    }


# ✅ Task Distribution
@router.get("/task-distribution")
def task_distribution(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role == "admin":
        tasks = db.query(Task).all()

    elif current_user.role == "manager":
        tasks = db.query(Task).filter(
            Task.created_by_id == current_user.id
        ).all()

    else:
        tasks = db.query(Task).filter(
            Task.assigned_to_id == current_user.id
        ).all()

    distribution = {
        "todo": 0,
        "in_progress": 0,
        "review": 0,
        "done": 0
    }

    for task in tasks:
        status = (task.status or "todo").lower()

        if status in distribution:
            distribution[status] += 1

    return distribution