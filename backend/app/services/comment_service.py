from fastapi import HTTPException

from sqlalchemy.orm import Session

from sqlalchemy import select

from app.models.comment_model import Comment

from app.models.task_model import Task

from app.schemas.comment_schema import (

    CommentCreate

)

from app.services.audit_service import (

    create_audit_log

)


# ✅ Add Comment
def add_comment_service(

    task_id:int,

    data:CommentCreate,

    db:Session,

    current_user

):

    task=db.execute(

        select(

            Task

        ).where(

            Task.id

            ==

            task_id

        )

    ).scalars().first()


    if not task:

        raise HTTPException(

            status_code=404,

            detail=

            "Task not found"

        )


    if(

        data.is_internal

        and

        current_user.role

        ==

        "employee"

    ):

        raise HTTPException(

            status_code=403,

            detail=

            "Employees cannot create internal comments"

        )


    comment=Comment(

        task_id=task_id,

        user_id=current_user.id,

        content=data.content,

        is_internal=data.is_internal

    )


    db.add(

        comment

    )

    db.commit()

    db.refresh(

        comment

    )


    create_audit_log(

        db=db,

        user_id=current_user.id,

        action="comment added",

        entity="comment",

        entity_id=comment.id

    )


    return comment


# ✅ Get Comments
def get_comments_service(

    task_id:int,

    db:Session,

    current_user

):

    task=db.execute(

        select(

            Task

        ).where(

            Task.id

            ==

            task_id

        )

    ).scalars().first()


    if not task:

        raise HTTPException(

            status_code=404,

            detail=

            "Task not found"

        )


    comments=db.execute(

        select(

            Comment

        ).where(

            Comment.task_id

            ==

            task_id

        )

    ).scalars().all()


    if current_user.role=="employee":

        comments=[

            comment

            for comment in comments

            if not comment.is_internal

        ]


    return comments