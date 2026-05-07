from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from datetime import datetime
from app.database import Base

class ApprovalHistory(Base):
    __tablename__ = "approval_history"

    id = Column(Integer, primary_key=True, index=True)
    approval_id = Column(Integer, ForeignKey("approvals.id"))
    action_by = Column(Integer, ForeignKey("users.id"))
    action = Column(String(50))
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)