/**
 * Interpretation engine — connects raw scores to personalized content.
 */
import type {
  AssessmentResult,
  ScoreTier,
  EnhancedFunctionInfo,
  PersonalizedResult,
  GrowthRecommendation,
} from '../types';
import {
  FUNC_NAMES,
  FUNC_LABELS,
  FUNC_DESCRIPTIONS,
  SCORE_TIER_LABELS,
} from '../types';
import {
  FUNCTION_INTERPRETATIONS,
  TYPE_DYNAMICS,
  GROWTH_RECOMMENDATIONS,
  STYLE_PROFILES,
} from '../data/interpretations';
import { matchJobs } from './jobMatcher';

export function getScoreTier(score: number): ScoreTier {
  if (score <= 25) return 'very_low';
  if (score <= 40) return 'low';
  if (score <= 55) return 'moderate';
  if (score <= 70) return 'balanced';
  if (score <= 85) return 'high';
  return 'very_high';
}

export function getFunctionInterpretation(func: string, score: number) {
  const tier = getScoreTier(score);
  const fnData = FUNCTION_INTERPRETATIONS[func];
  if (!fnData) return null;
  const interp = fnData[tier] || fnData.balanced;
  return { tier, tierLabel: SCORE_TIER_LABELS[tier], interpretation: interp };
}

export function getAllFunctionInterpretations(
  scores: Record<string, number>,
): EnhancedFunctionInfo[] {
  const entries = FUNC_NAMES.map((f) => ({
    code: f,
    score: scores[f] || 50,
  }));
  entries.sort((a, b) => b.score - a.score);

  return entries.map(({ code, score }, rank) => {
    const info = getFunctionInterpretation(code, score);
    return {
      code,
      label: FUNC_LABELS[code],
      description: FUNC_DESCRIPTIONS[code],
      score,
      rank: rank + 1,
      tier: info?.tier || 'balanced',
      tierLabel: info?.tierLabel || '均衡运用',
      interpretation: info?.interpretation || FUNCTION_INTERPRETATIONS[code]?.balanced!,
    };
  });
}

export function getStyle(type: string, styleMap: Record<string, string>): string {
  return styleMap[type] || '';
}

function determineStyles(scores: Record<string, number>) {
  const maxFunc = FUNC_NAMES.reduce((a, b) => (scores[a] > scores[b] ? a : b));

  let commKey = '';
  if (scores.Te >= 70 && (maxFunc === 'Te' || scores.Te > scores.Fe + 10)) commKey = 'TeDom';
  else if (scores.Ti >= 70 && (maxFunc === 'Ti' || scores.Ti > scores.Fe + 10)) commKey = 'TiDom';
  else if (scores.Fe >= 70 && (maxFunc === 'Fe' || scores.Fe > scores.Te + 10)) commKey = 'FeDom';
  else if (scores.Fi >= 70 && (maxFunc === 'Fi' || scores.Fi > scores.Ti + 10)) commKey = 'FiDom';
  else if (scores.Ne >= 60) commKey = 'NeAux';
  else if (scores.Ni >= 60) commKey = 'NiAux';
  else commKey = scores.Te > scores.Ti ? 'TeDom' : 'TiDom';

  let decisionKey = '';
  if (scores.Te >= 65) decisionKey = 'TeHigh';
  else if (scores.Ti >= 65) decisionKey = 'TiHigh';
  else if (scores.Fe >= 65) decisionKey = 'FeHigh';
  else if (scores.Fi >= 65) decisionKey = 'FiHigh';
  else decisionKey = scores.Te > scores.Fe ? 'TeHigh' : 'FeHigh';

  let learningKey = '';
  if (scores.Se >= 55) learningKey = 'SePref';
  else if (scores.Si >= 55) learningKey = 'SiPref';
  else if (scores.Ne >= 55) learningKey = 'NePref';
  else learningKey = 'NiPref';

  return {
    communication: STYLE_PROFILES.communication[commKey] || '',
    decision: STYLE_PROFILES.decision[decisionKey] || '',
    learning: STYLE_PROFILES.learning[learningKey] || '',
  };
}

export function generatePersonalizedResult(result: AssessmentResult): PersonalizedResult {
  const { function_scores: scores, function_stack: stack, best_match: best } = result;
  const scoresMap = scores as unknown as Record<string, number>;

  const functionDetails = getAllFunctionInterpretations(scoresMap);
  const dom = stack[0];
  const aux = stack[1];
  const ter = stack[2];
  const inf = stack[3];

  const typeCode = best.type_code;
  const typeDynamics = TYPE_DYNAMICS[typeCode] || TYPE_DYNAMICS.INTJ;

  const growthWeakest: GrowthRecommendation = GROWTH_RECOMMENDATIONS[inf] || GROWTH_RECOMMENDATIONS.Se;
  const growthStrongest: GrowthRecommendation = GROWTH_RECOMMENDATIONS[dom] || GROWTH_RECOMMENDATIONS.Ni;

  const jobMatches = matchJobs(scoresMap);

  const styles = determineStyles(scoresMap);

  const summary = `${best.type_code}「${typeCode}」是你的最佳匹配类型。你的主导功能是${FUNC_LABELS[dom]}，辅助功能是${FUNC_LABELS[aux]}。你最自然的认知模式是：${FUNC_DESCRIPTIONS[dom]}，并借助${FUNC_DESCRIPTIONS[aux]}来辅助判断和行动。你的劣势功能是${FUNC_LABELS[inf]}——这既是你的盲点也是你的成长方向。`;

  return {
    functionDetails,
    dominantFunction: dom,
    auxiliaryFunction: aux,
    tertiaryFunction: ter,
    inferiorFunction: inf,
    typeDynamics,
    jobMatches,
    growthForWeakest: { func: inf, recommendation: growthWeakest },
    growthForStrongest: { func: dom, recommendation: growthStrongest },
    communicationStyle: styles.communication,
    decisionStyle: styles.decision,
    learningStyle: styles.learning,
    summary,
  };
}
