from sqlalchemy import (

    Column,

    Integer,

    String,

    DateTime,

    ForeignKey

)

from sqlalchemy.orm import (

    relationship

)

from datetime import (

    datetime

)

from app.database import (

    Base

)


class Activity(Base):

    __tablename__="activities"


    id=Column(

        Integer,

        primary_key=True,

        index=True

    )


    user_id=Column(

        Integer,

        ForeignKey(

            "users.id"

        ),

        index=True

    )


    action=Column(

        String(255)

    )


    entity=Column(

        String(100)

    )


    entity_id=Column(

        Integer

    )


    created_at=Column(

        DateTime,

        default=datetime.utcnow

    )


    user=relationship(

        "User"

    )