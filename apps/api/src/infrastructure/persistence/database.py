import os
from sqlmodel import create_engine, SQLModel, Session
from typing import Generator

# For local development, using SQLite if DATABASE_URL is not set
# In production, this will be PostgreSQL (Railway/Neon)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./freegeny.db")

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    from apps.api.src.infrastructure.persistence import models
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
