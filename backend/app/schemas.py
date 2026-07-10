"""Pydantic schemas for API request/response validation."""

from pydantic import BaseModel, Field
from typing import Optional


class AnswerItem(BaseModel):
    question_id: str
    value: int  # For Likert: 1-7, For SJT: option index, For forced-choice: 0 or 1


class SubmitRequest(BaseModel):
    answers: list[AnswerItem] = Field(..., min_length=1)
    duration_seconds: Optional[int] = None


class FunctionScores(BaseModel):
    Se: float = 0
    Si: float = 0
    Ne: float = 0
    Ni: float = 0
    Te: float = 0
    Ti: float = 0
    Fe: float = 0
    Fi: float = 0


class QualityReport(BaseModel):
    consistency_score: float = 1.0  # 0-1, 1 = perfectly consistent
    consistency_warning: bool = False
    attention_passed: bool = True
    attention_failures: int = 0
    social_desirability_score: float = 0.0
    social_desirability_warning: bool = False


class TypeMatch(BaseModel):
    type_code: str
    distance: float
    match_percentage: float


class SubmitResponse(BaseModel):
    result_id: str
    function_scores: FunctionScores
    function_stack: list[str]  # e.g. ["Ni", "Te", "Fi", "Se", ...]
    best_match: TypeMatch
    second_match: TypeMatch
    all_matches: list[TypeMatch]
    quality: QualityReport
    warnings: list[str] = []


class ResultResponse(BaseModel):
    result_id: str
    created_at: str
    function_scores: FunctionScores
    function_stack: list[str]
    best_match: str
    second_match: str
    consistency_score: float
    attention_passed: bool
    duration_seconds: Optional[int]


class QuestionItem(BaseModel):
    id: str
    text: str
    type: str  # "likert" | "sjt" | "forced_choice" | "attention" | "social_desirability"
    options: Optional[list[dict]] = None  # For SJT and forced_choice
    function_tag: Optional[str] = None  # Se/Si/Ne/Ni/Te/Ti/Fe/Fi
    is_reversed: bool = False
    consistency_pair_id: Optional[str] = None


class StatsResponse(BaseModel):
    total_results: int
    type_distribution: dict[str, int]
