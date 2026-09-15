from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Interview
from ..schemas import InterviewCreate

router = APIRouter(prefix="/interviews", tags=["Interviews"])

@router.post("/")
def create_interview(data: InterviewCreate, db: Session = Depends(get_db)):
    interview = Interview(**data.model_dump())
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview

@router.get("/")
def get_interviews(db: Session = Depends(get_db)):
    return db.query(Interview).order_by(Interview.id.desc()).all()

@router.get("/{interview_id}")
def get_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = db.query(Interview).filter(
        Interview.id == interview_id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    return interview
