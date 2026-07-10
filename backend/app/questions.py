"""Question bank loader and management."""

import json
from pathlib import Path
from typing import Optional


DATA_DIR = Path(__file__).parent.parent / "data"


def load_questions(filepath: Optional[str] = None) -> list[dict]:
    """Load questions from JSON file."""
    path = Path(filepath) if filepath else DATA_DIR / "questions.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("questions", [])


def get_questions_for_client() -> list[dict]:
    """
    Return questions without answer metadata (expected_value etc.)
    for client-side consumption.
    """
    questions = load_questions()
    client_questions = []
    for q in questions:
        client_q = {
            "id": q["id"],
            "text": q["text"],
            "type": q["type"],
            "options": q.get("options"),
        }
        # Don't expose function_tag or is_reversed to client
        client_questions.append(client_q)
    return client_questions


def get_question_map(questions: list[dict]) -> dict[str, dict]:
    """Build a lookup map from question ID to question data."""
    return {q["id"]: q for q in questions}
