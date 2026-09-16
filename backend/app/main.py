from fastapi import FastAPI
from sqlalchemy import inspect, text
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .models import Task, Interview
from .routes.tasks import router as task_router
from .routes.interviews import router as interview_router

app = FastAPI(title="Salarite Virtual HR API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://salarite-virtual-hr-git-main-komlaksh.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

if "meeting_link" not in {column["name"] for column in inspect(engine).get_columns("interviews")}:
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE interviews ADD COLUMN meeting_link VARCHAR(2048) NULL"))

app.include_router(task_router)
app.include_router(interview_router)

@app.get("/")
def root():
    return {"message": "Salarite Virtual HR API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}