/**
 * Client-side scoring engine — ported from backend/app/scoring.py
 * Runs entirely in the browser, no backend needed.
 */
import type { FunctionScores, QualityReport, TypeMatch, Answer } from '../types';
import { FUNC_NAMES } from '../types';

const TYPE_TEMPLATES: Record<string, number[]> = {
  INTJ: [1, 0, 0, 4, 3, 0, 0, 2],
  INTP: [0, 1, 3, 0, 0, 4, 2, 0],
  INFJ: [1, 0, 0, 4, 0, 2, 3, 0],
  INFP: [0, 1, 3, 0, 1, 0, 0, 4],
  ISTJ: [1, 4, 0, 0, 3, 0, 0, 2],
  ISFJ: [1, 4, 0, 0, 0, 2, 3, 0],
  ISTP: [3, 0, 0, 1, 0, 4, 0, 0],
  ISFP: [3, 0, 0, 1, 2, 0, 0, 4],
  ENTJ: [2, 0, 1, 3, 4, 0, 0, 0],
  ENTP: [1, 0, 4, 0, 0, 3, 2, 0],
  ENFJ: [2, 0, 1, 3, 0, 0, 4, 0],
  ENFP: [1, 0, 4, 0, 2, 0, 0, 3],
  ESTJ: [2, 3, 1, 0, 4, 0, 0, 0],
  ESFJ: [2, 3, 1, 0, 0, 0, 4, 0],
  ESTP: [4, 0, 0, 1, 0, 3, 0, 2],
  ESFP: [4, 0, 0, 1, 2, 0, 0, 3],
};

export function computeScores(
  answers: Answer[],
  questions: any[],
): FunctionScores {
  const rawScores: Record<string, number> = {};
  const maxScores: Record<string, number> = {};
  for (const f of FUNC_NAMES) {
    rawScores[f] = 0;
    maxScores[f] = 0;
  }

  const qMap: Record<string, any> = {};
  for (const q of questions) qMap[q.id] = q;

  for (const answer of answers) {
    const q = qMap[answer.question_id];
    if (!q || q.type === 'attention') continue;

    const qtype = q.type || 'likert';
    const value = answer.value;

    if (qtype === 'likert') {
      const func = q.function_tag;
      if (!func || !(func in rawScores)) continue;
      let score = value;
      if (q.is_reversed) score = 8 - score;
      rawScores[func] += score;
      maxScores[func] += 7;
    } else if (qtype === 'sjt') {
      const options = q.options || [];
      if (value >= 0 && value < options.length) {
        const opt = options[value];
        const tag = opt.function_tag || '';
        if (tag in rawScores) {
          rawScores[tag] += opt.weight || 0;
          maxScores[tag] += 4;
        }
      }
    } else if (qtype === 'forced_choice') {
      const options = q.options || [];
      if (value >= 0 && value < options.length) {
        const tag = options[value].function_tag || '';
        if (tag in rawScores) {
          rawScores[tag] += 2;
          maxScores[tag] += 2;
        }
      }
    }
  }

  const scores: any = {};
  for (const f of FUNC_NAMES) {
    scores[f] = maxScores[f] > 0
      ? Math.round((rawScores[f] / maxScores[f]) * 1000) / 10
      : 50;
  }
  return scores as FunctionScores;
}

export function buildFunctionStack(scores: FunctionScores): string[] {
  const entries = FUNC_NAMES.map((f) => [f, (scores as any)[f]] as [string, number]);
  entries.sort((a, b) => b[1] - a[1]);
  return entries.map(([f]) => f);
}

export function computeTypeMatches(scores: FunctionScores): TypeMatch[] {
  const userVec = FUNC_NAMES.map((f) => (scores as any)[f] / 25);
  const matches: TypeMatch[] = [];

  for (const [code, template] of Object.entries(TYPE_TEMPLATES)) {
    let diffSq = 0;
    for (let i = 0; i < 8; i++) {
      diffSq += (userVec[i] - template[i]) ** 2;
    }
    const distance = Math.sqrt(diffSq);
    const matchPct = Math.max(0, Math.min(100, Math.round((1 - distance / 10) * 1000) / 10));
    matches.push({ type_code: code, distance: Math.round(distance * 100) / 100, match_percentage: matchPct });
  }
  matches.sort((a, b) => a.distance - b.distance);
  return matches;
}

export function checkQuality(
  answers: Answer[],
  questions: any[],
): QualityReport {
  const qMap: Record<string, any> = {};
  for (const q of questions) qMap[q.id] = q;

  // Attention checks
  let attentionFailures = 0;
  for (const a of answers) {
    const q = qMap[a.question_id];
    if (q && q.type === 'attention' && q.expected_value !== undefined) {
      if (a.value !== q.expected_value) attentionFailures++;
    }
  }

  // Consistency pairs
  const pairs: Record<string, string[]> = {};
  for (const q of questions) {
    const pid = q.consistency_pair_id;
    if (pid) {
      if (!pairs[pid]) pairs[pid] = [];
      pairs[pid].push(q.id);
    }
  }

  let consistencyScore = 1.0;
  const diffs: number[] = [];
  for (const [, qids] of Object.entries(pairs)) {
    if (qids.length === 2) {
      const a1 = answers.find((a) => a.question_id === qids[0]);
      const a2 = answers.find((a) => a.question_id === qids[1]);
      if (a1 && a2) {
        const q1 = qMap[qids[0]];
        const q2 = qMap[qids[1]];
        const v1 = q1.is_reversed ? 8 - a1.value : a1.value;
        const v2 = q2.is_reversed ? 8 - a2.value : a2.value;
        diffs.push(Math.abs(v1 - v2));
      }
    }
  }
  if (diffs.length > 0) {
    const avgDiff = diffs.reduce((s, d) => s + d, 0) / diffs.length;
    consistencyScore = Math.max(0, Math.round((1 - avgDiff / 6) * 100) / 100);
  }

  // Social desirability
  let sdScore = 0;
  let sdCount = 0;
  for (const a of answers) {
    const q = qMap[a.question_id];
    if (q && q.type === 'social_desirability') {
      sdScore += a.value;
      sdCount++;
    }
  }
  const sdPct = sdCount > 0 ? Math.round((sdScore / (sdCount * 7)) * 1000) / 10 : 0;

  return {
    consistency_score: consistencyScore,
    consistency_warning: consistencyScore < 0.6,
    attention_passed: attentionFailures === 0,
    attention_failures: attentionFailures,
    social_desirability_score: sdPct,
    social_desirability_warning: sdPct > 75,
  };
}

export function generateWarnings(quality: QualityReport): string[] {
  const warnings: string[] = [];
  if (!quality.attention_passed) {
    warnings.push(
      `你在 ${quality.attention_failures} 道注意力检测题中未能通过，结果可能不够可靠。建议认真重测。`,
    );
  }
  if (quality.consistency_warning) {
    warnings.push(
      '你的作答一致性较低，可能在答题过程中状态有波动。建议在精力充沛时重新测试。',
    );
  }
  if (quality.social_desirability_warning) {
    warnings.push(
      '你的作答可能受到了社会期望的影响——你可能倾向于选择"看起来更好"的答案而非真实的自己。',
    );
  }
  return warnings;
}
