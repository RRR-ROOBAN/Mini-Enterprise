from fastapi import (

    APIRouter,

    Depends

)

from sqlalchemy.orm import Session

from app.database import get_db

from app.services.auth_service import (

    get_current_user

)

from app.services.ai_service import (

    get_ai_insights

)


router=APIRouter(

prefix="/ai",

tags=["AI"]

)


@router.get(

"/insights"

)

def insights(

db:Session=Depends(

get_db

),

current_user=Depends(

get_current_user

)

):

    return get_ai_insights(

        db,

        current_user

    )