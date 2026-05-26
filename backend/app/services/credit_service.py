from sqlalchemy import (

select

)

from app.models.organization_model import (

Organization

)


def deduct_credit(

    organization,

    amount,

    db

):

    if(

        organization.credits

        <

        amount

    ):

        raise Exception(

            "Insufficient credits"

        )


    organization.credits-=amount


    db.commit()


def add_credit(

    organization,

    amount,

    db

):

    organization.credits+=amount


    db.commit()


def use_credit(

    organization_id,

    amount,

    db

):

    organization=db.execute(

        select(

            Organization

        ).where(

            Organization.id

            ==

            organization_id

        )

    ).scalar_one_or_none()


    if not organization:

        return{

            "message":

            "Organization not found"

        }


    if(

        organization.credits

        <

        amount

    ):

        return{

            "message":

            "Insufficient credits"

        }


    organization.credits-=amount


    db.commit()


    db.refresh(

        organization

    )


    return{

        "organization":

        organization.name,

        "remaining_credits":

        organization.credits

    }