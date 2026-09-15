from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    assigned_to: str
    created_by: str
    priority: str = "medium"


class TaskUpdate(BaseModel):
    status: str


class InterviewCreate(BaseModel):
    candidate_name: str
    task_id: int | None = None
    mode: str
    meeting_link: str | None = None
    interview_date: str
    interview_time: str