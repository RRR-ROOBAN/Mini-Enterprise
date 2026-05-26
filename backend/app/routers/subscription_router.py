from fastapi import (

APIRouter,

Depends

)

from sqlalchemy.orm import (

Session

)

from app.database import (

get_db

)

from app.services.subscription_service import (

upgrade_plan

)


router=APIRouter(

prefix="/subscription",

tags=["Subscription"]

)


@router.put(

"/upgrade/{organization_id}"

)

def upgrade(

organization_id:int,

plan:str,

db:Session=

Depends(

get_db

)

):

    return upgrade_plan(

        organization_id,

        plan,

        db

    )