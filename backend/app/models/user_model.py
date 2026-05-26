from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime
)

from sqlalchemy.orm import (
    relationship
)

from datetime import datetime

from app.database import Base

from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

class User(Base):

    __tablename__ = "users"

    # ✅ Primary Key
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ✅ Search Fields
    name = Column(
        String(100),
        nullable=False,
        index=True
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    hashed_password = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(50),
        nullable=False,
        index=True
    )

    is_active = Column(
        Boolean,
        default=True,
        index=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        index=True
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        index=True
    )

    # ✅ Relationships
    assigned_tasks = relationship(
        "Task",
        foreign_keys="Task.assigned_to_id"
    )
    
    organization_id=Column(

    Integer,

    ForeignKey(
        "organizations.id"
    )

    )

    organization=relationship(

        "Organization",

        back_populates="users"

    )