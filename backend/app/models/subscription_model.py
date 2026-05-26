from sqlalchemy import (

Column,

Integer,

String,

Float,

DateTime

)

from datetime import datetime

from app.database import Base


class Subscription(

Base

):

    __tablename__="subscriptions"


    id=Column(

        Integer,

        primary_key=True,

        index=True

    )


    plan_name=Column(

        String(50),

        nullable=False

    )


    price=Column(

        Float,

        nullable=False

    )


    credits=Column(

        Integer,

        default=0

    )


    duration_days=Column(

        Integer,

        default=30

    )


    created_at=Column(

        DateTime,

        default=datetime.utcnow

    )