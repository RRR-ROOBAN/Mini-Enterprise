from fastapi import (

    APIRouter,

    Depends

)

from sqlalchemy.orm import Session

from sqlalchemy import select

from app.database import get_db

from app.models.activity_model import Activity

from app.services.auth_service import (

    get_current_user

)

router=APIRouter(

    prefix="/activities",

    tags=["Activities"]

)

@router.get("/")

def get_activities(

    db:Session=Depends(

        get_db

    ),

    current_user=Depends(

        get_current_user

    )

):

    activities=db.execute(

        select(

            Activity

        ).order_by(

            Activity.created_at.desc()

        )

    ).scalars().all()

    return activities