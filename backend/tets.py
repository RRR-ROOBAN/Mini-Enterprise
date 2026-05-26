from datetime import datetime, timezone
 
from sqlalchemy import Boolean, DateTime, Enum, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
 
from app.core.database import Base




class User(Base):
    __tablename__ = "users"
 
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), default=UserRole.user, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False) 
    verification_token: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
 
    projects = relationship(
        "Project", back_populates="owner", cascade="all, delete-orphan"
    )
    subscription = relationship(
        "Subscription",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
 
__table_args__ = (
        Index("ix_users_role", "role"),
        Index("ix_users_verified", "email_verified"),
    )
 