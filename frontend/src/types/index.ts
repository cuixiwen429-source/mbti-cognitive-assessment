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
