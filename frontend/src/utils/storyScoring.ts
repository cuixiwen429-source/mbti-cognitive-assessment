/**
 * Story mode scoring engine.
 * Processes story-based answers into standard FunctionScores,
 * then delegates to existing scoring.ts for type matching and quality checks.
 */
import type { FunctionScores, QualityReport, StoryAnswer } from '../types';
import { FUNC_NAMES } from '../types';
import { STORY_CHAPTERS } from '../data/scenarios';

export function scoreStoryAnswers(answers: StoryAnswer[]): FunctionScores {
  const rawScores: Record<string, number> = {};
  const maxScores: Record<string, number> = {};

  for (const f of FUNC_NAMES) {
    rawScores[f] = 0;
    maxScores[f] = 0;
  }

  // Build a lookup for decisions
  const decisionMap: Record<string, { chapterId: number; decisionIndex: number }> = {};
  for (const ch of STORY_CHAPTERS) {
    ch.decisions.forEach((d, i) => {
      decisionMap[d.id] = { chapterId: ch.id, decisionIndex: i };
    });
  }

  for (const answer of answers) {
    const meta = decisionMap[answer.decisionId];
    if (!meta) continue;

    const chapter = STORY_CHAPTERS.find((ch) => ch.id === meta.chapterId);
    if (!chapter) continue;

    // Skip attention check decisions
    if (chapter.hasAttentionCheck && meta.decisionIndex === chapter.attentionDecisionIndex) {
      continue;
    }

    const decision = chapter.decisions[meta.decisionIndex];
    if (!decision || answer.selectedOption < 0 || answer.selectedOption >= decision.options.length) {
      continue;
    }

    const option = decision.options[answer.selectedOption];
    const funcs = option.functions as Record<string, number>;

    for (const [func, weight] of Object.entries(funcs)) {
      if (func in rawScores) {
        rawScores[func] += weight;
        maxScores[func] += 4; // Each option has max weight ~4
      }
    }
  }

  // Normalize to 0-100
  const scores: Record<string, number> = {};
  for (const f of FUNC_NAMES) {
    scores[f] = maxScores[f] > 0
      ? Math.round((rawScores[f] / maxScores[f]) * 1000) / 10
      : 50;
  }

  return scores as unknown as FunctionScores;
}

/**
 * Check story attention: verify the attention check decision was answered correctly.
 */
export function checkStoryAttention(answers: StoryAnswer[]): { passed: boolean; failures: number } {
  let failures = 0;

  for (const ch of STORY_CHAPTERS) {
    if (!ch.hasAttentionCheck) continue;

    const attentionDecision = ch.decisions[ch.attentionDecisionIndex!];
    if (!attentionDecision) continue;

    const answer = answers.find((a) => a.decisionId === attentionDecision.id);
    if (!answer || answer.selectedOption !== ch.attentionExpectedOption) {
      failures++;
    }
  }

  return { passed: failures === 0, failures };
}

/**
 * Check story consistency: compare decisions that test similar cognitive preferences
 * across different chapters.
 */
export function checkStoryConsistency(answers: StoryAnswer[]): { score: number; warning: boolean } {
  // Find paired decisions: ch1_d2 (path choice) and ch2_d5 (swamp choice) both test Se vs Ni preference
  const pairs = [
    { a: 'ch1_d2', b: 'ch3_d3', label: 'Se/Ni balance' },
    { a: 'ch4_d1', b: 'ch4_d4', label: 'Fe/Fi social style' },
    { a: 'ch2_d1', b: 'ch5_d1', label: 'Te/Ni decision style' },
  ];

  const diffs: number[] = [];
  for (const pair of pairs) {
    const ansA = answers.find((a) => a.decisionId === pair.a);
    const ansB = answers.find((a) => a.decisionId === pair.b);
    if (ansA && ansB) {
      // Compare the dominant function of the chosen options
      const getDominantFunc = (decisionId: string, optIdx: number): string => {
        for (const ch of STORY_CHAPTERS) {
          const dec = ch.decisions.find((d) => d.id === decisionId);
          if (dec && optIdx < dec.options.length) {
            const funcs = dec.options[optIdx].functions as Record<string, number>;
            const sorted = Object.entries(funcs).sort((a, b) => b[1] - a[1]);
            return sorted[0]?.[0] || '';
          }
        }
        return '';
      };

      const funcA = getDominantFunc(pair.a, ansA.selectedOption);
      const funcB = getDominantFunc(pair.b, ansB.selectedOption);

      // Same function chosen → consistent = 0 diff
      // Different function → diff = 1
      diffs.push(funcA === funcB ? 0 : 1);
    }
  }

  if (diffs.length === 0) return { score: 1, warning: false };
  const avgDiff = diffs.reduce((s, d) => s + d, 0) / diffs.length;
  const score = Math.max(0, Math.round((1 - avgDiff) * 100) / 100);
  return { score, warning: score < 0.5 };
}

/**
 * Full quality report for story mode.
 */
export function checkStoryQuality(answers: StoryAnswer[]): QualityReport {
  const attention = checkStoryAttention(answers);
  const consistency = checkStoryConsistency(answers);

  return {
    consistency_score: consistency.score,
    consistency_warning: consistency.warning,
    attention_passed: attention.passed,
    attention_failures: attention.failures,
    social_desirability_score: 0, // Not measured in story mode
    social_desirability_warning: false,
  };
}
