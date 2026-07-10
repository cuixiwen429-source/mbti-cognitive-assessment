"""SQLAlchemy database models."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, Text, create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


class Base(DeclarativeBase):
    pass


class Result(Base):
    __tablename__ = "results"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4())[:8])
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Function scores as JSON string
    scores_json = Column(Text, nullable=False)

    # Type matching
    best_match = Column(String(4), nullable=False)
    second_match = Column(String(4), nullable=False)
    all_matches_json = Column(Text, nullable=False)

    # Quality metrics
    consistency_score = Column(Float, default=1.0)
    attention_passed = Column(Boolean, default=True)
    social_desirability_score = Column(Float, default=0.0)

    # Metadata
    duration_seconds = Column(Integer, nullable=True)
    share_id = Column(String(8), unique=True, default=lambda: str(uuid.uuid4())[:8])


# SQLite for MVP
DATABASE_URL = "sqlite:///./mbti_cognitive.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)


def init_db():
    """Create all tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency: get a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
