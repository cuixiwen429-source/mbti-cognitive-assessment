"""API router for submitting and retrieving results."""

import json
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..models import Result, get_db
from ..questions import load_questions
from ..schemas import (
    SubmitRequest,
    SubmitResponse,
    ResultResponse,
    StatsResponse,
    FunctionScores,
)
from ..scoring import (
    compute_scores,
    build_function_stack,
    compute_type_matches,
    check_quality,
    generate_warnings,
)

router = APIRouter(prefix="/api", tags=["results"])


@router.post("/submit", response_model=SubmitResponse)
async def submit_answers(request: SubmitRequest, db: Session = Depends(get_db)):
    """Submit answers and get assessment results."""
    # Load full question data (includes scoring metadata)
    questions = load_questions()

    # 1. Compute function scores
    scores, raw_scores, diagnostics = compute_scores(request.answers, questions)

    # 2. Build function stack
    stack = build_function_stack(scores)

    # 3. Type matching
    all_matches = compute_type_matches(scores)
    best_match = all_matches[0]
    second_match = all_matches[1] if len(all_matches) > 1 else all_matches[0]

    # 4. Quality checks
    quality = check_quality(request.answers, questions)
    warnings = generate_warnings(quality)

    # 5. Save result
    result_id = str(uuid.uuid4())[:8]
    share_id = str(uuid.uuid4())[:8]

    result = Result(
        id=result_id,
        scores_json=scores.model_dump_json(),
        best_match=best_match.type_code,
        second_match=second_match.type_code,
        all_matches_json=json.dumps([m.model_dump() for m in all_matches]),
        consistency_score=quality.consistency_score,
        attention_passed=quality.attention_passed,
        social_desirability_score=quality.social_desirability_score,
        duration_seconds=request.duration_seconds,
        share_id=share_id,
    )
    db.add(result)
    db.commit()

    return SubmitResponse(
        result_id=result_id,
        function_scores=scores,
        function_stack=stack,
        best_match=best_match,
        second_match=second_match,
        all_matches=all_matches,
        quality=quality,
        warnings=warnings,
    )


@router.get("/result/{result_id}", response_model=ResultResponse)
async def get_result(result_id: str, db: Session = Depends(get_db)):
    """Retrieve a saved result by ID."""
    result = db.query(Result).filter(Result.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")

    scores_data = json.loads(result.scores_json)

    return ResultResponse(
        result_id=result.id,
        created_at=result.created_at.isoformat(),
        function_scores=FunctionScores(**scores_data),
        function_stack=sorted(
            scores_data.keys(),
            key=lambda f: scores_data[f],
            reverse=True,
        ),
        best_match=result.best_match,
        second_match=result.second_match,
        consistency_score=result.consistency_score,
        attention_passed=result.attention_passed,
        duration_seconds=result.duration_seconds,
    )


@router.get("/stats", response_model=StatsResponse)
async def get_stats(db: Session = Depends(get_db)):
    """Get aggregate statistics."""
    total = db.query(Result).count()

    results = db.query(Result.best_match).all()
    type_dist = {}
    for (match,) in results:
        type_dist[match] = type_dist.get(match, 0) + 1

    return StatsResponse(total_results=total, type_distribution=type_dist)
