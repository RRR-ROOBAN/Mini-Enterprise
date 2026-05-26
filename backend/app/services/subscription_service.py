from sqlalchemy import (
    select
)

from app.models.organization_model import (
    Organization
)


PLAN_DETAILS={

    "Basic":{

        "credits":100

    },

    "Silver":{

        "credits":500

    },

    "Gold":{

        "credits":1000

    }

}


def upgrade_plan(

    organization_id,

    new_plan,

    db

):

    org=db.execute(

        select(

            Organization

        ).where(

            Organization.id

            ==

            organization_id

        )

    ).scalar_one_or_none()


    if not org:

        return{

            "message":

            "Organization not found"

        }


    if new_plan not in PLAN_DETAILS:

        return{

            "message":

            "Invalid plan"

        }


    org.plan=new_plan

    org.credits=PLAN_DETAILS[

        new_plan

    ][

        "credits"

    ]


    db.commit()

    db.refresh(

        org

    )


    return{

        "organization":

        org.name,

        "plan":

        org.plan,

        "credits":

        org.credits

    }