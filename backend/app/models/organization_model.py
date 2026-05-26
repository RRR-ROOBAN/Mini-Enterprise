from sqlalchemy import (

Column,

Integer,

String,

DateTime

)

from sqlalchemy.orm import (

relationship

)

from datetime import datetime

from app.database import Base


class Organization(Base):

    __tablename__="organizations"


    id=Column(

        Integer,

        primary_key=True,

        index=True

    )


    name=Column(

        String(255),

        unique=True,

        nullable=False

    )


    plan=Column(

        String(50),

        default="Basic"

    )


    credits=Column(

        Integer,

        default=100

    )


    created_at=Column(

        DateTime,

        default=datetime.utcnow

    )


    users=relationship(

        "User",

        back_populates="organization"

    )