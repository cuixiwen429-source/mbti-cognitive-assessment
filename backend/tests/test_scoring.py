"""Unit tests for the scoring engine."""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.scoring import (
    compute_scores,
    build_function_stack,
    compute_type_matches,
    check_quality,
    generate_warnings,
)
from app.schemas import AnswerItem, FunctionScores


# Minimal question set for testing
TEST_QUESTIONS = [
    {"id": "likert_te_01", "text": "Te test", "type": "likert", "function_tag": "Te", "is_reversed": False},
    {"id": "likert_ti_01", "text": "Ti test", "type": "likert", "function_tag": "Ti", "is_reversed": False},
    {"id": "likert_rev_01", "text": "Reversed test", "type": "likert", "function_tag": "Se", "is_reversed": True},
    {"id": "sjt_01", "text": "SJT test", "type": "sjt", "function_tag": None,
     "options": [
         {"text": "A", "function_tag": "Te", "weight": 4},
         {"text": "B", "function_tag": "Ti", "weight": 3},
         {"text": "C", "function_tag": "Fe", "weight": 2},
         {"text": "D", "function_tag": "Fi", "weight": 1},
     ]},
    {"id": "fc_01", "text": "FC test", "type": "forced_choice", "function_tag": None,
     "options": [
         {"text": "A", "function_tag": "Te"},
         {"text": "B", "function_tag": "Ti"},
     ]},
    {"id": "attn_01", "text": "Attention check", "type": "attention", "expected_value": 1},
    {"id": "sd_01", "text": "Social desirability", "type": "social_desirability"},
    {"id": "c1_a", "text": "Consistency A", "type": "likert", "function_tag": "Ne", "consistency_pair_id": "c1"},
    {"id": "c1_b", "text": "Consistency B", "type": "likert", "function_tag": "Ne", "consistency_pair_id": "c1"},
]


def test_likert_scoring():
    """Likert questions directly add to function scores."""
    answers = [
        AnswerItem(question_id="likert_te_01", value=7),
        AnswerItem(question_id="likert_ti_01", value=3),
    ]
    scores, raw, _ = compute_scores(answers, TEST_QUESTIONS)
    assert scores.Te > scores.Ti, f"Expected Te > Ti, got Te={scores.Te}, Ti={scores.Ti}"
    assert scores.Te > 50  # 7/7 = 100%


def test_reverse_scoring():
    """Reversed questions should invert the score."""
    answers = [AnswerItem(question_id="likert_rev_01", value=1)]
    scores, raw, _ = compute_scores(answers, TEST_QUESTIONS)
    # value=1 → reversed → 7 → high Se score
    assert scores.Se > 80, f"Expected high Se, got {scores.Se}"


def test_sjt_scoring():
    """SJT options route scores to tagged functions."""
    answers = [AnswerItem(question_id="sjt_01", value=0)]  # Pick option A → Te
    scores, raw, _ = compute_scores(answers, TEST_QUESTIONS)
    assert scores.Te > scores.Fi, f"Expected Te > Fi, got Te={scores.Te}, Fi={scores.Fi}"


def test_forced_choice_scoring():
    """Forced choice adds to the selected function."""
    answers = [AnswerItem(question_id="fc_01", value=0)]  # Pick option A → Te
    scores, raw, _ = compute_scores(answers, TEST_QUESTIONS)
    assert scores.Te > 0


def test_build_function_stack():
    """Stack should sort by score descending."""
    scores = FunctionScores(Se=30, Si=50, Ne=80, Ni=60, Te=90, Ti=40, Fe=20, Fi=70)
    stack = build_function_stack(scores)
    assert stack[0] == "Te", f"Expected Te first, got {stack[0]}"
    assert stack[1] == "Ne"
    assert stack[-1] == "Fe"


def test_type_matches():
    """Type matching should find high Te = likely ENTJ or ESTJ."""
    scores = FunctionScores(Se=30, Si=20, Ne=40, Ni=60, Te=90, Ti=50, Fe=30, Fi=20)
    matches = compute_type_matches(scores)
    best = matches[0]
    # High Te, Ni should favor ENTJ or ESTJ
    assert best.type_code in ("ENTJ", "ESTJ"), f"Expected ENTJ/ESTJ, got {best.type_code}"


def test_attention_check():
    """Failing attention check should be detected."""
    answers = [
        AnswerItem(question_id="attn_01", value=7),  # Wrong! Expected 1
    ]
    quality = check_quality(answers, TEST_QUESTIONS)
    assert not quality.attention_passed
    assert quality.attention_failures == 1


def test_consistency_check():
    """Consistency pairs with similar values should score high."""
    answers = [
        AnswerItem(question_id="c1_a", value=5),
        AnswerItem(question_id="c1_b", value=5),
    ]
    quality = check_quality(answers, TEST_QUESTIONS)
    assert quality.consistency_score > 0.9, f"Expected >0.9, got {quality.consistency_score}"

    # Dissimilar values → lower consistency
    answers2 = [
        AnswerItem(question_id="c1_a", value=1),
        AnswerItem(question_id="c1_b", value=7),
    ]
    quality2 = check_quality(answers2, TEST_QUESTIONS)
    assert quality2.consistency_score < 0.6, f"Expected <0.6, got {quality2.consistency_score}"


def test_warnings_generation():
    """Warnings should be generated for quality issues."""
    from app.schemas import QualityReport
    quality = QualityReport(
        consistency_score=0.3,
        consistency_warning=True,
        attention_passed=False,
        attention_failures=2,
        social_desirability_score=85,
        social_desirability_warning=True,
    )
    warnings = generate_warnings(quality)
    assert len(warnings) == 3


if __name__ == "__main__":
    test_likert_scoring()
    test_reverse_scoring()
    test_sjt_scoring()
    test_forced_choice_scoring()
    test_build_function_stack()
    test_type_matches()
    test_attention_check()
    test_consistency_check()
    test_warnings_generation()
    print("✅ All tests passed!")
