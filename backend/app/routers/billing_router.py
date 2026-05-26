from fastapi import (

APIRouter

)

from app.services.stripe_service import (

create_payment

)


router=APIRouter(

prefix="/billing",

tags=["Billing"]

)


@router.post(

"/pay"

)

def payment(

amount:int

):

    return create_payment(

        amount

    )