from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assigned_to = Column(String(255), nullable=False)
    created_by = Column(String(255), nullable=False)
    status = Column(String(50), default="pending")
    priority = Column(String(50), default="medium")
    created_at = Column(DateTime, server_default=func.now())


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String(255), nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    mode = Column(String(50), nullable=False)
    meeting_link = Column(String(2048), nullable=True)
    interview_date = Column(String(50), nullable=False)
    interview_time = Column(String(50), nullable=False)
    status = Column(String(50), default="scheduled")