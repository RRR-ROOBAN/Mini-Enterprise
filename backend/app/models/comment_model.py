from sqlalchemy import Column, Integer, Text, Boolean, ForeignKey, DateTime
from datetime import datetime
from app.database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    content = Column(Text)
    is_internal = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)