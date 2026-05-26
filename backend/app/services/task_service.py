from fastapi import HTTPException

from sqlalchemy.orm import (

    Session,

    selectinload

)

from sqlalchemy import select

from app.models.task_model import Task

from app.models.user_model import User

from app.schemas.task_schema import TaskCreate

from app.utils.workflow import VALID_TRANSITIONS

from app.services.audit_service import (

    create_audit_log

)

from app.services.notification_service import (

    create_notification

)

from app.services.activity_service import (

    create_activity

)

from app.database import (

    redis_client

)

from app.websocket_manager import (

    manager

)

import asyncio


# ✅ Cache Clear
def clear_dashboard_cache(

    user_id

):

    redis_client.delete(

        f"dashboard_summary_{user_id}"

    )

    redis_client.delete(

        f"task_distribution_{user_id}"

    )


# ✅ Create Task
def create_task_service(

    task:TaskCreate,

    db:Session,

    current_user

):

    query=select(

        User

    ).where(

        User.id

        ==

        task.assigned_to_id

    )

    assigned_user=db.execute(

        query

    ).scalars().first()


    if not assigned_user:

        raise HTTPException(

            status_code=404,

            detail=

            "Assigned user not found"

        )


    if assigned_user.role!="employee":

        raise HTTPException(

            status_code=400,

            detail=

            "Task only assign employee"

        )


    new_task=Task(

        title=task.title,

        description=task.description,

        priority=task.priority,

        due_date=task.due_date,

        created_by_id=current_user.id,

        assigned_to_id=task.assigned_to_id

    )


    db.add(

        new_task

    )

    db.commit()

    db.refresh(

        new_task

    )


    clear_dashboard_cache(

        current_user.id

    )

    clear_dashboard_cache(

        task.assigned_to_id

    )


    create_audit_log(

        db=db,

        user_id=current_user.id,

        action="created",

        entity="task",

        entity_id=new_task.id

    )


    create_notification(

        db=db,

        user_id=

        new_task.assigned_to_id,

        message=

        f"New task assigned: {new_task.title}"

    )


    create_notification(

        db=db,

        user_id=

        current_user.id,

        message=

        f"You created task: {new_task.title}"

    )


    create_activity(

        db=db,

        user_id=current_user.id,

        action="Created Task",

        entity="Task",

        entity_id=new_task.id

    )


    return new_task


# ✅ Get Tasks
def get_tasks_service(

    db,

    current_user,

    page,

    limit

):

    query = select(

        Task

    ).options(

        selectinload(

            Task.assigned_user

        )

    )

    if current_user.role=="manager":

        query=query.where(

            Task.created_by_id

            == current_user.id

        )

    elif current_user.role=="employee":

        query=query.where(

            Task.assigned_to_id

            == current_user.id

        )

    total=len(

        db.execute(

            query

        ).scalars().all()

    )

    skip=(

        page-1

    )*limit

    tasks=db.execute(

        query.offset(

            skip

        ).limit(

            limit

        )

    ).scalars().all()

    return {

        "page":page,

        "limit":limit,

        "total_tasks":total,

        "total_pages":(

            total+limit-1

        )//limit,

        "tasks":tasks

    }


# ✅ Update Task
def update_task_service(

    task_id,

    task,

    db

):

    existing=db.execute(

        select(Task).where(

            Task.id==task_id

        )

    ).scalars().first()

    if not existing:

        raise HTTPException(

            status_code=404,

            detail="Task not found"

        )

    existing.title=task.title

    existing.description=task.description

    existing.priority=task.priority

    existing.due_date=task.due_date

    db.commit()

    db.refresh(

        existing

    )

    return existing


# ✅ Delete Task
def delete_task_service(

    task_id,

    db

):

    task=db.execute(

        select(Task).where(

            Task.id==task_id

        )

    ).scalars().first()

    if not task:

        raise HTTPException(

            status_code=404,

            detail="Task not found"

        )

    db.delete(

        task

    )

    db.commit()

    return {

        "message":

        "Task deleted"

    }


# ✅ Update Status
def update_status_service(

    task_id,

    status,

    db,

    current_user

):

    task=db.execute(

        select(Task).where(

            Task.id==task_id

        )

    ).scalars().first()

    if not task:

        raise HTTPException(

            status_code=404,

            detail="Task not found"

        )

    current=(

        task.status

        or "todo"

    ).lower()

    new=status.lower()

    if new not in VALID_TRANSITIONS[current]:

        raise HTTPException(

            status_code=400,

            detail="Invalid transition"

        )

    task.status=new

    db.commit()

    db.refresh(

        task

    )

    create_audit_log(

        db=db,

        user_id=current_user.id,

        action=f"status changed {new}",

        entity="task",

        entity_id=task.id

    )

    create_activity(

        db=db,

        user_id=current_user.id,

        action=f"Moved task to {new}",

        entity="Task",

        entity_id=task.id

    )

    payload={

        "id":task.id,

        "title":task.title,

        "status":task.status,

        "priority":task.priority

    }

    try:

        asyncio.run(

            manager.broadcast_kanban(

                payload

            )

        )

    except Exception as e:

        print(

            "Kanban:",

            e

        )

    return task


# ✅ Kanban
def get_kanban_tasks_service(

    db,

    current_user

):

    query=select(

        Task

    )


    if current_user.role=="manager":

        query=query.where(

            Task.created_by_id

            ==

            current_user.id

        )


    elif current_user.role=="employee":

        query=query.where(

            Task.assigned_to_id

            ==

            current_user.id

        )


    tasks=db.execute(

        query

    ).scalars().all()


    kanban={

        "todo":[],

        "in_progress":[],

        "review":[],

        "done":[]

    }


    for task in tasks:


        status=(

            task.status

            or

            "todo"

        ).lower()


        if status not in kanban:

            status="todo"


        kanban[status].append({

            "id":task.id,

            "title":task.title,

            "description":task.description,

            "priority":task.priority

        })


    return kanban