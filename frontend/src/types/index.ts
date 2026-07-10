/** Core type definitions for the MBTI Cognitive Function Assessment */

export type QuestionType = 'likert' | 'sjt' | 'forced_choice' | 'attention';

export interface QuestionOption {
  text: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
}

export interface Answer {
  question_id: string;
  value: number;
}

export interface FunctionScores {
  Se: number;
  Si: number;
  Ne: number;
  Ni: number;
  Te: number;
  Ti: number;
  Fe: number;
  Fi: number;
}

export interface TypeMatch {
  type_code: string;
  distance: number;
  match_percentage: number;
}

export interface QualityReport {
  consistency_score: number;
  consistency_warning: boolean;
  attention_passed: boolean;
  attention_failures: number;
  social_desirability_score: number;
  social_desirability_warning: boolean;
}

export interface AssessmentResult {
  result_id: string;
  function_scores: FunctionScores;
  function_stack: string[];
  best_match: TypeMatch;
  second_match: TypeMatch;
  all_matches: TypeMatch[];
  quality: QualityReport;
  warnings: string[];
}

/* ──────── New types for enhanced result interpretation ──────── */

export type ScoreTier = 'very_low' | 'low' | 'moderate' | 'balanced' | 'high' | 'very_high';

export const SCORE_TIER_LABELS: Record<ScoreTier, string> = {
  very_low: '较少使用',
  low: '偶尔使用',
  moderate: '适度使用',
  balanced: '均衡运用',
  high: '经常使用',
  very_high: '主导使用',
};

export const SCORE_TIER_COLORS: Record<ScoreTier, string> = {
  very_low: 'bg-gray-400 text-white',
  low: 'bg-sky-400 text-white',
  moderate: 'bg-blue-500 text-white',
  balanced: 'bg-emerald-500 text-white',
  high: 'bg-indigo-500 text-white',
  very_high: 'bg-violet-500 text-white',
};

export interface FunctionTierInterpretation {
  overview: string;
  dailyLife: string;
  work: string;
  relationships: string;
  growth: string;
}

export interface EnhancedFunctionInfo {
  code: string;
  label: string;
  description: string;
  score: number;
  rank: number;
  tier: ScoreTier;
  tierLabel: string;
  interpretation: FunctionTierInterpretation;
}

export interface TypeDynamicsData {
  dominantAuxLoop: string;
  tertiaryTemptation: string;
  inferiorGrip: string;
  growthPath: string;
}

export interface GrowthRecommendation {
  forLowScore: string;
  forHighScore: string;
  exercises: string[];
}

export interface JobProfile {
  title: string;
  category: string;
  functionRequirements: FunctionScores;
  confidence: 1 | 2 | 3;
  sources: string;
  matchReason: string;
}

export interface JobMatchResult extends JobProfile {
  matchScore: number;
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  durationSeconds: number;
  result: AssessmentResult;
}

export interface PersonalizedResult {
  functionDetails: EnhancedFunctionInfo[];
  dominantFunction: string;
  auxiliaryFunction: string;
  tertiaryFunction: string;
  inferiorFunction: string;
  typeDynamics: TypeDynamicsData;
  jobMatches: JobMatchResult[];
  growthForWeakest: { func: string; recommendation: GrowthRecommendation };
  growthForStrongest: { func: string; recommendation: GrowthRecommendation };
  communicationStyle: string;
  decisionStyle: string;
  learningStyle: string;
  summary: string;
}

/* ──────── Constants ──────── */

export const FUNC_NAMES = ['Se', 'Si', 'Ne', 'Ni', 'Te', 'Ti', 'Fe', 'Fi'] as const;

export const FUNC_LABELS: Record<string, string> = {
  Se: '外倾感觉',
  Si: '内倾感觉',
  Ne: '外倾直觉',
  Ni: '内倾直觉',
  Te: '外倾思维',
  Ti: '内倾思维',
  Fe: '外倾情感',
  Fi: '内倾情感',
};

export const FUNC_DESCRIPTIONS: Record<string, string> = {
  Se: '沉浸当下，敏锐察觉物理环境细节，喜欢实际行动和感官体验',
  Si: '依赖过往经验和记忆，注重稳定、传统和细节，善于回顾总结',
  Ne: '发散联想，探索可能性和新想法，善于看到事物之间的连接',
  Ni: '聚焦洞察，寻找深层模式和本质，善于预见未来的走向',
  Te: '外部逻辑体系，追求效率和结果，善于组织资源和推动执行',
  Ti: '内部逻辑自洽，追求精确和原理，善于分析和归纳',
  Fe: '维护群体和谐，关注他人感受和需求，善于建立人际关系',
  Fi: '坚守内在价值，关注个人信念和情感真实性，善于自我觉察',
};

export const TYPE_DESCRIPTIONS: Record<string, string> = {
  INTJ: '建筑师 — 战略思维者，善于长远规划和系统设计',
  INTP: '逻辑学家 — 创新分析者，善于理论构建和问题解决',
  INFJ: '提倡者 — 安静的神秘主义者，善于洞察人心和指引方向',
  INFP: '调停者 — 理想主义者，忠于价值观和内在和谐',
  ISTJ: '物流师 — 务实的管理者，可靠、细致、严谨',
  ISFJ: '守卫者 — 专注的照顾者，温暖、负责、注重传统',
  ISTP: '鉴赏家 — 实践型问题解决者，善于动手和临场应变',
  ISFP: '探险家 — 灵活的美学家，善于发现和创造美',
  ENTJ: '指挥官 — 大胆的领导者，善于制定目标和驱动执行',
  ENTP: '辩论家 — 聪明的创新者，善于挑战常规和头脑风暴',
  ENFJ: '主人公 — 富有魅力的导师，善于激励和培养他人',
  ENFP: '竞选者 — 热情的自由灵魂，善于发现潜力和创造可能',
  ESTJ: '总经理 — 出色的组织者，善于管理和维持秩序',
  ESFJ: '执政官 — 热情的协调者，善于服务和照顾他人',
  ESTP: '企业家 — 精力充沛的行动派，善于把握机会和即兴发挥',
  ESFP: '表演者 — 自发的娱乐家，善于创造快乐和活在当下',
};

/** Stack position labels */
export const STACK_LABELS = ['主导功能', '辅助功能', '第三功能', '劣势功能'];
export const STACK_COLORS = ['bg-primary', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-400'];

/* ──────── Story Mode Types ──────── */

export interface StoryOption {
  text: string;
  functions: Partial<FunctionScores>;
}

export interface StoryDecision {
  id: string;
  context: string;
  question: string;
  options: StoryOption[];
}

export interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  scene: string;
  gradient: string;
  icon: string;
  decisions: StoryDecision[];
  /** Branch type — which cognitive dimension triggers branching after this chapter */
  branchType?: 'perceiving' | 'judging';
  /** Whether this is a final ending chapter */
  isEnding?: boolean;
  /** Human-readable label for the ending type */
  endingLabel?: string;
  /** Attention check config (unchanged) */
  hasAttentionCheck?: boolean;
  attentionExpectedOption?: number;
  attentionDecisionIndex?: number;
}

export interface StoryAnswer {
  decisionId: string;
  selectedOption: number;
  chapterId: number;
}

/* ──────── Constants ──────── */

/** 16 MBTI type ideal function stacks — [Se, Si, Ne, Ni, Te, Ti, Fe, Fi] weights 1-4 */
export const TYPE_FULL_TEMPLATES: Record<string, number[]> = {
  INTJ: [1, 0, 0, 4, 3, 0, 0, 2],  INTP: [0, 1, 3, 0, 0, 4, 2, 0],
  INFJ: [1, 0, 0, 4, 0, 2, 3, 0],  INFP: [0, 1, 3, 0, 1, 0, 0, 4],
  ISTJ: [1, 4, 0, 0, 3, 0, 0, 2],  ISFJ: [1, 4, 0, 0, 0, 2, 3, 0],
  ISTP: [3, 0, 0, 1, 0, 4, 0, 0],  ISFP: [3, 0, 0, 1, 2, 0, 0, 4],
  ENTJ: [2, 0, 1, 3, 4, 0, 0, 0],  ENTP: [1, 0, 4, 0, 0, 3, 2, 0],
  ENFJ: [2, 0, 1, 3, 0, 0, 4, 0],  ENFP: [1, 0, 4, 0, 2, 0, 0, 3],
  ESTJ: [2, 3, 1, 0, 4, 0, 0, 0],  ESFJ: [2, 3, 1, 0, 0, 0, 4, 0],
  ESTP: [4, 0, 0, 1, 0, 3, 0, 2],  ESFP: [4, 0, 0, 1, 2, 0, 0, 3],
};

/* ──────── V2: 《十九点二十分》 ──────── */

export type PreferenceDimension = 'EI' | 'SN' | 'TF' | 'JP';
export type V2OptionScore = -2 | -1 | 1 | 2;
export type DimensionBand = 'balanced' | 'leaning' | 'clear';
export type V2QualityGrade = 'high' | 'medium' | 'low' | 'insufficient';
export type V2StoryEnding = 'record' | 'pause' | 'walk';

export interface V2VersionSet {
  assessment: string;
  itemBank: string;
  story: string;
  scoring: string;
}

export interface V2AssessmentOption {
  optionId: string;
  text: string;
  score?: V2OptionScore;
  feedback: string;
}

export interface V2AssessmentItem {
  id: string;
  kind: 'scored' | 'attention';
  context: string;
  prompt: string;
  dimension?: PreferenceDimension;
  options: V2AssessmentOption[];
  expectedOptionId?: string;
  consistencyPairId?: string;
}

export interface V2StoryChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  time: string;
  location: string;
  scene: string;
  object: string;
  clue: string;
  transition: string;
  speaker?: string;
  sceneImage?: string;
  items: V2AssessmentItem[];
}

export interface V2FinaleChoice {
  id: V2StoryEnding;
  title: string;
  text: string;
  endingText: string;
}

export interface V2Finale {
  scene: string;
  prompt: string;
  choices: V2FinaleChoice[];
}

export interface V2ConsistencyPair {
  id: string;
  itemIds: [string, string];
  relation: 'same' | 'opposite';
}

export interface V2AssessmentDefinition {
  id: string;
  title: string;
  version: V2VersionSet;
  durationMinutes: [number, number];
  intro: string;
  chapters: V2StoryChapter[];
  finale: V2Finale;
  consistencyPairs?: V2ConsistencyPair[];
}

export interface V2AssessmentResponse {
  itemId: string;
  optionId: string;
  presentedOptionIds: string[];
  presentedPosition: number;
  responseTimeMs: number;
  chapterId: string;
  answeredAt: string;
}

export interface V2StoryState {
  unlockedClues: string[];
  feedbackVariants: Record<string, string>;
  ending?: V2StoryEnding;
}

export interface V2DimensionResult {
  dimension: PreferenceDimension;
  score: number;
  band: DimensionBand;
  negativePole: string;
  positivePole: string;
}

export interface V2QualityReport {
  grade: V2QualityGrade;
  attentionCorrect: number;
  attentionTotal: number;
  attentionPassed: boolean;
  completionRate: number;
  fastResponseRatio: number;
  consistencyScore: number | null;
  validConsistencyPairs: number;
  flags: string[];
}

export interface V2AssessmentResult {
  resultId: string;
  sessionId: string;
  version: V2VersionSet;
  completedAt: string;
  durationSeconds: number;
  dimensionScores: Record<PreferenceDimension, V2DimensionResult>;
  bestFitType: string;
  candidates: string[];
  uncertainDimensions: PreferenceDimension[];
  functionStack: string[];
  quality: V2QualityReport;
  ending?: V2StoryEnding;
}

export interface V2AssessmentDraft {
  sessionId: string;
  seed: string;
  version: V2VersionSet;
  currentIndex: number;
  responses: V2AssessmentResponse[];
  storyState: V2StoryState;
  startedAt: string;
  itemStartedAt: string;
}

export interface V2HistoryEntry {
  id: string;
  createdAt: string;
  result: V2AssessmentResult;
  responses: V2AssessmentResponse[];
}
