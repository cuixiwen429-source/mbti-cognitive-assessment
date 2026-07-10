"""Core scoring engine for cognitive function assessment.

Algorithm:
1. Raw score per function from Likert (1-7), SJT (weighted options), forced-choice
2. Normalize to 0-100 scale
3. Sort into function stack
4. Match against 16 type templates via Euclidean distance
5. Quality checks: attention, consistency, social desirability
"""

import math
from typing import Optional

from .schemas import (
    AnswerItem,
    FunctionScores,
    QualityReport,
    TypeMatch,
)
from .type_templates import FUNC_NAMES, TYPE_FULL_TEMPLATES


def compute_scores(
    answers: list[AnswerItem],
    questions: list[dict],
) -> tuple[FunctionScores, dict, dict]:
    """
    Compute raw and normalized function scores from answers.

    Returns:
        (normalized_scores, raw_scores, diagnostics)
    """
    # Sum of raw scores per function
    raw_scores = {f: 0.0 for f in FUNC_NAMES}
    # Max possible per function (for normalization)
    max_scores = {f: 0.0 for f in FUNC_NAMES}

    # Build question lookup
    q_map = {q["id"]: q for q in questions}

    for answer in answers:
        q = q_map.get(answer.question_id)
        if not q or q.get("type") in ("attention",):
            continue

        qtype = q.get("type", "likert")
        value = answer.value

        if qtype == "likert":
            func = q.get("function_tag")
            if not func or func not in raw_scores:
                continue
            score = float(value)
            if q.get("is_reversed"):
                score = 8 - score
            raw_scores[func] += score
            max_scores[func] += 7.0

        elif qtype == "sjt":
            # function_tag is on each option, not the question
            options = q.get("options", [])
            if 0 <= value < len(options):
                opt = options[value]
                weight = opt.get("weight", 0)
                tag = opt.get("function_tag", "")
                if tag in raw_scores:
                    raw_scores[tag] += weight
                    max_scores[tag] += 4.0

        elif qtype == "forced_choice":
            # function_tag is on each option
            options = q.get("options", [])
            if 0 <= value < len(options):
                opt = options[value]
                tag = opt.get("function_tag", "")
                if tag in raw_scores:
                    raw_scores[tag] += 2.0
                    max_scores[tag] += 2.0

        elif qtype == "social_desirability":
            # Scored separately, not for function measurement
            pass

    # Normalize to 0-100
    normalized = {}
    for f in FUNC_NAMES:
        if max_scores[f] > 0:
            normalized[f] = round((raw_scores[f] / max_scores[f]) * 100, 1)
        else:
            normalized[f] = 50.0  # Default mid-point if no questions

    return (
        FunctionScores(**normalized),
        raw_scores,
        {"max_scores": max_scores},
    )


def build_function_stack(scores: FunctionScores) -> list[str]:
    """Sort functions by score descending → function stack."""
    scored = [(f, getattr(scores, f)) for f in FUNC_NAMES]
    scored.sort(key=lambda x: x[1], reverse=True)
    return [f for f, _ in scored]


def compute_type_matches(scores: FunctionScores) -> list[TypeMatch]:
    """
    Compute Euclidean distance between user's 8D vector and each type template.
    Return sorted list of matches (closest first).
    """
    # Scale user scores from 0-100 to 0-4 to match template scale
    user_vec = [getattr(scores, f) / 25.0 for f in FUNC_NAMES]

    matches = []
    for type_code, template in TYPE_FULL_TEMPLATES.items():
        # Euclidean distance on 0-4 scale
        diff_sq = [
            (user_vec[i] - template[i]) ** 2
            for i in range(8)
        ]
        distance = math.sqrt(sum(diff_sq))

        # Max theoretical distance on 0-4 scale for 8D: sqrt(8 * 4^2) = sqrt(128) ≈ 11.3
        # Use 10 as practical max (templates sum to ~10, user sums to ~10-16)
        max_dist = 10.0
        match_pct = max(0.0, min(100.0, round((1 - distance / max_dist) * 100, 1)))

        matches.append(TypeMatch(
            type_code=type_code,
            distance=round(distance, 2),
            match_percentage=match_pct,
        ))

    matches.sort(key=lambda m: m.distance)
    return matches


def check_quality(
    answers: list[AnswerItem],
    questions: list[dict],
) -> QualityReport:
    """Run quality checks on the user's answers."""

    q_map = {q["id"]: q for q in questions}

    # 1. Attention checks
    attention_failures = 0
    for answer in answers:
        q = q_map.get(answer.question_id)
        if q and q.get("type") == "attention":
            expected = q.get("expected_value", 1)
            if answer.value != expected:
                attention_failures += 1

    # 2. Consistency pairs
    consistency_pairs = {}
    for q in questions:
        pair_id = q.get("consistency_pair_id")
        if pair_id:
            if pair_id not in consistency_pairs:
                consistency_pairs[pair_id] = []
            consistency_pairs[pair_id].append(q["id"])

    consistency_score = 1.0
    if consistency_pairs:
        diffs = []
        for pair_id, qids in consistency_pairs.items():
            if len(qids) == 2:
                a1 = next((a for a in answers if a.question_id == qids[0]), None)
                a2 = next((a for a in answers if a.question_id == qids[1]), None)
                if a1 and a2:
                    q1 = q_map[qids[0]]
                    q2 = q_map[qids[1]]
                    v1 = 8 - a1.value if q1.get("is_reversed") else a1.value
                    v2 = 8 - a2.value if q2.get("is_reversed") else a2.value
                    diffs.append(abs(v1 - v2))

        if diffs:
            avg_diff = sum(diffs) / len(diffs)
            # 0 diff → 1.0, 6 diff → 0.0
            consistency_score = max(0.0, round(1.0 - avg_diff / 6.0, 2))

    # 3. Social desirability
    sd_score = 0.0
    sd_count = 0
    for answer in answers:
        q = q_map.get(answer.question_id)
        if q and q.get("type") == "social_desirability":
            sd_score += answer.value
            sd_count += 1
    if sd_count > 0:
        sd_score = round(sd_score / (sd_count * 7) * 100, 1)

    return QualityReport(
        consistency_score=consistency_score,
        consistency_warning=consistency_score < 0.6,
        attention_passed=attention_failures == 0,
        attention_failures=attention_failures,
        social_desirability_score=sd_score,
        social_desirability_warning=sd_score > 75,
    )


def generate_warnings(quality: QualityReport) -> list[str]:
    """Generate user-facing warnings based on quality checks."""
    warnings = []
    if not quality.attention_passed:
        warnings.append(
            f"你在 {quality.attention_failures} 道注意力检测题中未能通过，"
            "结果可能不够可靠。建议认真重测。"
        )
    if quality.consistency_warning:
        warnings.append(
            "你的作答一致性较低，可能在答题过程中状态有波动。"
            "建议在精力充沛时重新测试。"
        )
    if quality.social_desirability_warning:
        warnings.append(
            "你的作答可能受到了社会期望的影响——"
            "你可能倾向于选择'看起来更好'的答案而非真实的自己。"
            "建议在放松状态下，按照第一反应重新作答。"
        )
    return warnings
