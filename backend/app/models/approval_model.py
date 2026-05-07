from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from datetime import datetime
from app.database import Base

class Approval(Base):
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)

    requested_by = Column(Integer, ForeignKey("users.id"))

    status = Column(String(50), default="pending")  # pending, approved, rejected, hold
    current_level = Column(String(50), default="manager")  # manager → admin

    created_at = Column(DateTime, default=datetime.utcnow)
    current_level="manager"