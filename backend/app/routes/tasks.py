from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import case
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Interview, Task
from ..schemas import TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/")
def create_task(data: TaskCreate, db: Session = Depends(get_db)):
    task = Task(**data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    status_order = case(
        (Task.status == "in_progress", 3),
        (Task.status == "pending", 2),
        (Task.status == "completed", 1),
        else_=0,
    )
    priority_order = case(
        (Task.priority == "high", 3),
        (Task.priority == "medium", 2),
        (Task.priority == "low", 1),
        else_=0,
    )
    return db.query(Task).order_by(
        status_order.desc(), priority_order.desc(), Task.id.desc()
    ).all()

@router.get("/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task

@router.put("/{task_id}")
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = data.status
    db.commit()
    db.refresh(task)

    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.query(Interview).filter(Interview.task_id == task_id).update(
        {Interview.task_id: None}, synchronize_session=False
    )
    db.delete(task)
    db.commit()

    return {"message": "Task deleted"}
