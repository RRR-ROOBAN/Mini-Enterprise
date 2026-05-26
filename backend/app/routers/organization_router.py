from fastapi import (

    APIRouter,

    Depends

)

from sqlalchemy.orm import (

    Session

)

from sqlalchemy import (

    select

)

from app.database import (

    get_db

)

from app.schemas.organization_schema import (

    OrganizationCreate

)

from app.services.organization_service import (

    create_organization

)

from app.services.auth_service import (

    get_current_user

)

from app.models.organization_model import (

    Organization

)


router=APIRouter(

    prefix="/organization",

    tags=["Organization"]

)


# ✅ Create Organization
@router.post(

    "/create"

)

def create(

    data:OrganizationCreate,

    db:Session=

    Depends(

        get_db

    )

):

    return create_organization(

        data,

        db

    )


# ✅ Current Organization
@router.get(

    "/me"

)

def get_my_organization(

    db:Session=

    Depends(

        get_db

    ),

    current_user=

    Depends(

        get_current_user

    )

):

    organization=db.execute(

        select(

            Organization

        ).where(

            Organization.id

            ==

            current_user.organization_id

        )

    ).scalars().first()


    if not organization:

        return{

            "message":

            "Organization not found"

        }


    return{

        "organization":

        organization.name,

        "plan":

        organization.plan,

        "credits":

        organization.credits

    }