from sqlalchemy import select

from datetime import datetime

from app.models.task_model import Task

from app.models.user_model import User


def get_ai_insights(

    db,

    current_user

):

    tasks=db.execute(

        select(Task)

    ).scalars().all()


    users=[

        u

        for u in

        db.execute(

            select(User)

        ).scalars().all()

        if

        u.role=="employee"

    ]


    high_priority=0

    delay_risk=0

    overload=[]

    performers=[]


    for task in tasks:

        if(

            task.priority

            and

            task.priority.lower()

            =="high"

            and

            task.status!="done"

        ):

            high_priority+=1


        if(

            task.due_date

            and

            task.status!="done"

            and

            task.due_date

            <

            datetime.utcnow()

        ):

            delay_risk+=1


    for user in users:

        user_tasks=[

            t

            for t in tasks

            if

            t.assigned_to_id

            ==

            user.id

        ]


        pending=len(

            [

                t

                for t in user_tasks

                if

                t.status!="done"

            ]

        )


        completed=len(

            [

                t

                for t in user_tasks

                if

                t.status=="done"

            ]

        )


        if pending>=5:

            overload.append(

                {

                "user":

                user.name,

                "pending_tasks":

                pending

                }

            )


        performers.append(

            {

            "user":

            user.name,

            "completed":

            completed,

            "pending":

            pending

            }

        )


    best_workload=min(

        performers,

        key=lambda x:

        x["pending"]

    )


    best_performance=max(

        performers,

        key=lambda x:

        x["completed"]

    )


    return{

        "high_priority_pending":

        high_priority,

        "delay_risk":

        delay_risk,

        "overloaded_users":

        overload,

        "recommended_by_workload":

        best_workload,

        "recommended_by_history":

        best_performance

    }