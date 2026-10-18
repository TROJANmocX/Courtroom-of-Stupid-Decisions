from sqlalchemy import create_engine, Column, String, Integer, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid

from config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    confession = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    personality = Column(String, nullable=False, default="brutally_honest")
    judge_name = Column(String, nullable=False)
    prosecutor_name = Column(String, nullable=False)
    defense_name = Column(String, nullable=False)
    evidence = Column(JSON, nullable=False, default=list)
    prosecution_arguments = Column(JSON, nullable=False, default=list)
    defense_arguments = Column(JSON, nullable=False, default=list)
    courtroom_events = Column(JSON, nullable=False, default=list)
    verdict = Column(String, nullable=False)
    sentence = Column(Text, nullable=False)
    severity_score = Column(Integer, nullable=False, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)
