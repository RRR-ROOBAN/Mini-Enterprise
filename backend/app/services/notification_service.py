from sqlalchemy.orm import Session

from sqlalchemy import select

from fastapi import HTTPException

from app.models.notification_model import (

    Notification

)

from app.models.user_model import (

    User

)

from app.websocket_manager import (

    manager

)

import asyncio

import threading


# ✅ Create Notification
def create_notification(

    db:Session,

    user_id:int,

    message:str

):

    user=db.execute(

        select(

            User

        ).where(

            User.id

            ==

            user_id

        )

    ).scalars().first()


    notification=Notification(

        user_id=user_id,

        message=message,

        organization_id=

        user.organization_id

    )


    db.add(

        notification

    )

    db.commit()

    db.refresh(

        notification


    )


    # 🔥 Realtime Push
    def send_ws():

        asyncio.run(

            manager.send_notification(

                user_id,

                message

            )

        )


    threading.Thread(

        target=send_ws

    ).start()


    return notification



# ✅ Get Notifications
def get_notifications_service(

    db:Session,

    current_user

):

    notifications=db.execute(

        select(

            Notification

        ).where(

            Notification.user_id

            ==

            current_user.id,

            Notification.organization_id

            ==

            current_user.organization_id

        )

    ).scalars().all()


    return notifications



# ✅ Mark Read
def mark_notification_read_service(

    notification_id:int,

    db:Session,

    current_user

):

    notification=db.execute(

        select(

            Notification

        ).where(

            Notification.id

            ==

            notification_id,

            Notification.organization_id

            ==

            current_user.organization_id

        )

    ).scalars().first()


    if not notification:

        raise HTTPException(

            status_code=404,

            detail=

            "Notification not found"

        )


    if(

        notification.user_id

        !=

        current_user.id

    ):

        raise HTTPException(

            status_code=403,

            detail=

            "Not allowed"

        )


    notification.is_read=True


    db.commit()

    db.refresh(

        notification

    )


    return notification