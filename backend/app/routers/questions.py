"""API router for questions."""

from fastapi import APIRouter

from ..questions import get_questions_for_client
from ..schemas import QuestionItem

router = APIRouter(prefix="/api", tags=["questions"])


@router.get("/questions", response_model=list[QuestionItem])
async def get_questions():
    """Return all questions for the assessment (without answer data)."""
    return get_questions_for_client()
