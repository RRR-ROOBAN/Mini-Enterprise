from sqlalchemy.orm import (

    Session

)

from sqlalchemy import (

    select

)

from app.models.activity_model import (

    Activity

)

from app.models.user_model import (

    User

)


def create_activity(

    db:Session,

    user_id:int,

    action:str,

    entity:str,

    entity_id:int

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


    activity=Activity(

        user_id=user_id,

        action=action,

        entity=entity,

        entity_id=entity_id,

        organization_id=

        user.organization_id

    )


    db.add(

        activity

    )

    db.commit()

    db.refresh(

        activity

    )


    return activity



def get_activity_service(

    db:Session,

    current_user

):

    activities=db.execute(

        select(

            Activity

        ).where(

            Activity.organization_id

            ==

            current_user.organization_id

        )

    ).scalars().all()


    return activities