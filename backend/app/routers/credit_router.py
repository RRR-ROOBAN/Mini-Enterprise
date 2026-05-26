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

from app.services.credit_service import (

use_credit

)


router=APIRouter(

prefix="/credits",

tags=["Credits"]

)


@router.put(

"/use/{organization_id}"

)

def deduct(

organization_id:int,

amount:int,

db:Session=

Depends(

get_db

)

):

    return use_credit(

    organization_id,

    amount,

    db

    )