from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.comment_model import Comment
from app.models.task_model import Task
from app.schemas.comment_schema import CommentCreate
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/tasks", tags=["Comments"])


# ✅ Add Comment
@router.post("/{task_id}/comments")
def add_comment(
    task_id: int,
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # 🔥 IMPORTANT FIX — prevent employee from internal comment
    if data.is_internal and current_user.role == "employee":
        raise HTTPException(
            status_code=403,
            detail="Employees cannot create internal comments"
        )

    comment = Comment(
        task_id=task_id,
        user_id=current_user.id,
        content=data.content,
        is_internal=data.is_internal
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment


# ✅ Get Comments
@router.get("/{task_id}/comments")
def get_comments(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    comments = db.query(Comment).filter(Comment.task_id == task_id).all()

    # 🔒 Hide internal comments from employees
    if current_user.role == "employee":
        comments = [c for c in comments if not c.is_internal]

    return comments