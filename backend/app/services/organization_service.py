from app.models.organization_model import (
    Organization
)


def create_organization(

    data,

    db

):

    org=Organization(

        name=data.name,

        plan=data.plan

    )

    db.add(org)

    db.commit()

    db.refresh(org)

    return org