from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import (relationship)

from datetime import datetime

from app.database import Base


class Task(Base):

    __tablename__ = "tasks"

    # ✅ Primary Key
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ✅ Frequently searched fields
    title = Column(
        String(100),
        nullable=False,
        index=True
    )

    description = Column(
        String(255)
    )

    status = Column(
        String(50),
        default="todo",
        index=True
    )

    priority = Column(
        String(50),
        default="medium",
        index=True
    )

    due_date = Column(
        DateTime,
        index=True
    )

    # ✅ Foreign Keys
    created_by_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True
    )

    assigned_to_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True
    )

    updated_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
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
    assigned_user = relationship(
        "User",
        foreign_keys=[assigned_to_id],
        overlaps="assigned_tasks"
    )

    created_user = relationship(
        "User",
        foreign_keys=[created_by_id]
    )