from sqlalchemy import (

Column,

Integer,

String,

Float,

ForeignKey,

DateTime

)

from datetime import datetime

from sqlalchemy.orm import relationship

from app.database import Base


class Billing(

Base

):

    __tablename__="billings"


    id=Column(

        Integer,

        primary_key=True,

        index=True

    )


    organization_id=Column(

        Integer,

        ForeignKey(

            "organizations.id"

        )

    )


    amount=Column(

        Float,

        nullable=False

    )


    payment_gateway=Column(

        String(50)

    )


    payment_status=Column(

        String(50),

        default="Pending"

    )


    transaction_id=Column(

        String(255)

    )


    created_at=Column(

        DateTime,

        default=datetime.utcnow

    )


    organization=relationship(

        "Organization"

    )