from sqlalchemy.orm import Session

from sqlalchemy import select

import json

from app.database import (
    redis_client
)

from app.models.task_model import Task

from app.models.approval_model import Approval


CACHE_EXPIRE = 60


# ✅ Dashboard Summary
def dashboard_summary_service(
    db: Session,
    current_user
):

    cache_key = (
        f"dashboard_summary_"
        f"{current_user.id}"
    )

    cached = redis_client.get(
        cache_key
    )

    if cached:

        return json.loads(
            cached
        )

    task_query = select(Task)

    approval_query = select(Approval)

    # ✅ Role filtering
    if current_user.role == "manager":

        task_query = task_query.where(

            Task.created_by_id
            == current_user.id
        )

    elif current_user.role == "employee":

        task_query = task_query.where(

            Task.assigned_to_id
            == current_user.id
        )

        approval_query = approval_query.where(

            Approval.requested_by
            == current_user.id
        )

    tasks = db.execute(
        task_query
    ).scalars().all()

    approvals = db.execute(
        approval_query
    ).scalars().all()

    total_tasks = len(
        tasks
    )

    completed_tasks = len([

        task

        for task in tasks

        if task.status == "done"

    ])

    in_progress = len([

        task

        for task in tasks

        if task.status == "in_progress"

    ])

    pending_tasks = len([

        task

        for task in tasks

        if task.status in [

            "todo",

            "review"
        ]

    ])

    pending_approvals = len([

        approval

        for approval in approvals

        if approval.status== "pending"

    ])

    result = {

        "total_tasks":
        total_tasks,

        "completed_tasks":
        completed_tasks,

        "in_progress":
        in_progress,

        "pending_tasks":
        pending_tasks,

        "pending_approvals":
        pending_approvals
    }

    redis_client.setex(

        cache_key,

        CACHE_EXPIRE,

        json.dumps(result)
    )

    return result


# ✅ Task Distribution
def task_distribution_service(

    db: Session,

    current_user
):

    cache_key = (

        f"task_distribution_"

        f"{current_user.id}"
    )

    cached = redis_client.get(
        cache_key
    )

    if cached:

        return json.loads(
            cached
        )

    query = select(Task)

    if current_user.role == "manager":

        query = query.where(

            Task.created_by_id
            == current_user.id
        )

    elif current_user.role == "employee":

        query = query.where(

            Task.assigned_to_id
            == current_user.id
        )

    tasks = db.execute(
        query
    ).scalars().all()

    distribution = {

        "todo": 0,

        "in_progress": 0,

        "review": 0,

        "done": 0
    }

    for task in tasks:

        status = (

            task.status
            or "todo"

        ).lower()

        if status in distribution:

            distribution[
                status
            ] += 1

    redis_client.setex(

        cache_key,

        CACHE_EXPIRE,

        json.dumps(
            distribution
        )
    )

    return distribution