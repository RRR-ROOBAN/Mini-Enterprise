from sqlalchemy import select

from sqlalchemy.orm import Session

from app.models.audit_log_model import (

    AuditLog

)

from app.models.user_model import (

    User

)


# ✅ Get Logs
def get_all_audit_logs(

    db:Session,

    current_user

):

    statement=select(

        AuditLog

    ).where(

        AuditLog.organization_id

        ==

        current_user.organization_id

    )


    result=db.execute(

        statement

    )


    logs=result.scalars().all()


    return logs



# ✅ Create Audit Log
def create_audit_log(

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


    log=AuditLog(

        user_id=user_id,

        action=action,

        entity=entity,

        entity_id=entity_id,

        organization_id=

        user.organization_id

    )


    db.add(

        log

    )

    db.commit()


    db.refresh(

        log

    )


    return log