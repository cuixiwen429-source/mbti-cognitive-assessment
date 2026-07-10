/**
 * China job market career database with cognitive function requirements.
 * Each job's functionRequirements are derived from research sources:
 * - CAPT Data Bank (Myers & McCaulley, 1985/1998): type prevalence by occupation
 * - arXiv:2504.17248 (VarastehNezhad et al., 2025): 18,264 tech workers meta-analysis
 * - BMC Medical Education (2024): medical students MBTI-career values
 * - O*NET job analysis database: cognitive skill requirements
 *
 * Confidence levels:
 *   ★★★ (3): Direct empirical support from CAPT data / meta-analysis
 *   ★★☆ (2): Theoretical derivation + industry observation + indirect data
 *   ★☆☆ (1): Cognitive function theory derivation only
 */
import type { JobProfile } from '../types';

export const JOB_DATABASE: JobProfile[] = [
  /* ═══════════════════ INTERNET / TECH ═══════════════════ */

  // ── R&D ──
  {
    title: '后端开发工程师', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.2, Si: 0.6, Ne: 0.4, Ni: 0.5, Te: 0.5, Ti: 0.9, Fe: 0.1, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: INTP/ISTJ 在程序员中最普遍; arXiv:2504.17248: Ti & Te 高过代表',
    matchReason: '深度逻辑分析(Ti) + 系统化思维(Si) + 效率执行(Te)',
  },
  {
    title: '前端开发工程师', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.6, Si: 0.3, Ne: 0.5, Ni: 0.3, Te: 0.4, Ti: 0.7, Fe: 0.2, Fi: 0.2 },
    confidence: 2, sources: 'CAPT Data Bank: ISTP/INTP 在开发中常见; O*NET 前端技能分析',
    matchReason: '技术分析(Ti) + 视觉感知(Se) + 创意探索(Ne)',
  },
  {
    title: '全栈工程师', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.4, Si: 0.5, Ne: 0.5, Ni: 0.4, Te: 0.5, Ti: 0.8, Fe: 0.1, Fi: 0.1 },
    confidence: 2, sources: 'CAPT Data Bank; 行业观察: 多层面技术整合',
    matchReason: '系统整合(Ti-Te) + 广度认知(Ne) + 经验积累(Si)',
  },
  {
    title: '算法工程师', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.1, Si: 0.3, Ne: 0.5, Ni: 0.7, Te: 0.3, Ti: 0.9, Fe: 0.0, Fi: 0.0 },
    confidence: 3, sources: 'arXiv:2504.17248: Ni & Ti 高过代表; CAPT: INTP/INTJ 在算法领域',
    matchReason: '极致逻辑(Ti) + 深度洞察(Ni) + 模式探索(Ne)',
  },
  {
    title: '数据分析师', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.2, Si: 0.5, Ne: 0.4, Ni: 0.5, Te: 0.6, Ti: 0.7, Fe: 0.1, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: INTJ/ISTJ 在数据分析中高比例; 行业数据',
    matchReason: '逻辑分析(Ti) + 数据驱动决策(Te) + 经验沉淀(Si)',
  },
  {
    title: '数据科学家', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.1, Si: 0.3, Ne: 0.6, Ni: 0.7, Te: 0.4, Ti: 0.8, Fe: 0.1, Fi: 0.0 },
    confidence: 3, sources: 'arXiv:2504.17248: Ni & Ne 高; CAPT: INTJ/INTP 常见',
    matchReason: '模式发现(Ni) + 探索创新(Ne) + 精准分析(Ti)',
  },
  {
    title: 'AI 研究员', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.1, Si: 0.2, Ne: 0.7, Ni: 0.8, Te: 0.3, Ti: 0.7, Fe: 0.0, Fi: 0.1 },
    confidence: 3, sources: 'arXiv:2504.17248: Ni-Ne 极高; CAPT: INTJ/INTP/ENTP',
    matchReason: '前沿洞察(Ni) + 理论探索(Ne) + 深度分析(Ti)',
  },
  {
    title: '测试开发工程师', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.3, Si: 0.7, Ne: 0.3, Ni: 0.3, Te: 0.6, Ti: 0.6, Fe: 0.1, Fi: 0.2 },
    confidence: 2, sources: '行业数据: ISTJ/ISTP 偏好系统性质量检查',
    matchReason: '细节把控(Si) + 系统验证(Ti) + 流程执行(Te)',
  },
  {
    title: '运维工程师(SRE)', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.5, Si: 0.7, Ne: 0.2, Ni: 0.3, Te: 0.6, Ti: 0.6, Fe: 0.1, Fi: 0.1 },
    confidence: 2, sources: '行业数据: ISTJ/ISTP 在运维中高比例',
    matchReason: '系统稳定性(Si) + 即时响应(Se) + 流程管理(Te)',
  },
  {
    title: '安全工程师', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.5, Si: 0.4, Ne: 0.4, Ni: 0.5, Te: 0.4, Ti: 0.8, Fe: 0.1, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: ISTP/INTP 在安全领域; 行业数据',
    matchReason: '漏洞发现(Ti-Ne) + 即时应对(Se) + 系统思维(Ni)',
  },
  {
    title: '系统架构师', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.2, Si: 0.4, Ne: 0.4, Ni: 0.8, Te: 0.6, Ti: 0.7, Fe: 0.1, Fi: 0.1 },
    confidence: 3, sources: 'arXiv:2504.17248: Ni-Te 组合最显著; CAPT: INTJ 高过代表',
    matchReason: '全局架构(Ni) + 系统化执行(Te) + 精准判断(Ti)',
  },
  {
    title: '嵌入式开发工程师', category: '互联网/科技·研发',
    functionRequirements: { Se: 0.5, Si: 0.6, Ne: 0.2, Ni: 0.3, Te: 0.5, Ti: 0.7, Fe: 0.1, Fi: 0.1 },
    confidence: 2, sources: 'CAPT Data Bank: ISTP/ISTJ 在嵌入式领域',
    matchReason: '硬件接触(Se) + 精确编程(Ti) + 流程管理(Si)',
  },

  // ── Product & Design ──
  {
    title: '产品经理', category: '互联网/科技·产品与设计',
    functionRequirements: { Se: 0.3, Si: 0.3, Ne: 0.7, Ni: 0.5, Te: 0.6, Ti: 0.4, Fe: 0.5, Fi: 0.3 },
    confidence: 2, sources: '行业观察: ENTP/INTJ 在产品管理中常见; 中国 HR 数据',
    matchReason: '需求洞察(Ne) + 推进落地(Te) + 用户共情(Fe)',
  },
  {
    title: 'AI 产品经理', category: '互联网/科技·产品与设计',
    functionRequirements: { Se: 0.2, Si: 0.3, Ne: 0.6, Ni: 0.7, Te: 0.5, Ti: 0.5, Fe: 0.3, Fi: 0.2 },
    confidence: 1, sources: '新兴岗位，基于技术与产品双重需求推导',
    matchReason: '技术理解(Ti-Ni) + 产品视野(Ne) + 落地执行(Te)',
  },
  {
    title: '用户研究员(UX Researcher)', category: '互联网/科技·产品与设计',
    functionRequirements: { Se: 0.4, Si: 0.4, Ne: 0.5, Ni: 0.4, Te: 0.3, Ti: 0.4, Fe: 0.7, Fi: 0.5 },
    confidence: 2, sources: '行业数据: INFJ/INFP/ENFP 在 UX 研究中常见; O*NET 岗位分析',
    matchReason: '用户共情(Fe) + 深度理解(Fi) + 模式发现(Ne)',
  },
  {
    title: '交互设计师', category: '互联网/科技·产品与设计',
    functionRequirements: { Se: 0.6, Si: 0.3, Ne: 0.6, Ni: 0.4, Te: 0.3, Ti: 0.5, Fe: 0.5, Fi: 0.3 },
    confidence: 2, sources: '行业数据: ISFP/INTP 在设计领域; O*NET 设计岗位',
    matchReason: '空间感知(Se) + 逻辑交互(Ti) + 用户感受(Fe)',
  },
  {
    title: 'UI 设计师', category: '互联网/科技·产品与设计',
    functionRequirements: { Se: 0.8, Si: 0.3, Ne: 0.4, Ni: 0.2, Te: 0.2, Ti: 0.3, Fe: 0.3, Fi: 0.5 },
    confidence: 2, sources: 'CAPT Data Bank: ISFP 在艺术/设计领域; 行业数据',
    matchReason: '视觉审美(Se) + 风格表达(Fi) + 创意探索(Ne)',
  },
  {
    title: '游戏策划', category: '互联网/科技·产品与设计',
    functionRequirements: { Se: 0.4, Si: 0.3, Ne: 0.8, Ni: 0.5, Te: 0.4, Ti: 0.5, Fe: 0.4, Fi: 0.3 },
    confidence: 2, sources: '行业数据: ENTP/INTP/ENFP 在游戏策划中常见',
    matchReason: '创意构思(Ne) + 系统设计(Ti) + 玩家共情(Fe)',
  },
  {
    title: '游戏数值策划', category: '互联网/科技·产品与设计',
    functionRequirements: { Se: 0.1, Si: 0.5, Ne: 0.4, Ni: 0.4, Te: 0.5, Ti: 0.8, Fe: 0.1, Fi: 0.1 },
    confidence: 2, sources: '行业数据: INTP/INTJ 在数值岗位',
    matchReason: '数学建模(Ti) + 系统平衡(Ni-Te) + 数据分析(Si)',
  },

  // ── Operations & Marketing ──
  {
    title: '用户运营', category: '互联网/科技·运营与市场',
    functionRequirements: { Se: 0.3, Si: 0.4, Ne: 0.5, Ni: 0.3, Te: 0.5, Ti: 0.3, Fe: 0.7, Fi: 0.3 },
    confidence: 2, sources: '行业数据: ESFJ/ENFJ 在运营岗位; 中国 HR 实践',
    matchReason: '用户关怀(Fe) + 数据分析(Si) + 策略执行(Te)',
  },
  {
    title: '内容运营', category: '互联网/科技·运营与市场',
    functionRequirements: { Se: 0.3, Si: 0.4, Ne: 0.7, Ni: 0.4, Te: 0.3, Ti: 0.3, Fe: 0.5, Fi: 0.4 },
    confidence: 2, sources: '行业数据: ENFP/ENFJ 在内容运营中常见',
    matchReason: '创意产出(Ne) + 受众感受(Fe) + 价值表达(Fi)',
  },
  {
    title: '增长黑客(Growth Hacker)', category: '互联网/科技·运营与市场',
    functionRequirements: { Se: 0.4, Si: 0.4, Ne: 0.7, Ni: 0.5, Te: 0.7, Ti: 0.5, Fe: 0.2, Fi: 0.1 },
    confidence: 2, sources: '行业观察: ENTP/ENTJ 在增长领域',
    matchReason: '实验驱动(Ne) + 数据优化(Te) + 创意思维(Ti)',
  },

  // ── Project Management ──
  {
    title: '技术项目经理(TPM)', category: '互联网/科技·项目管理',
    functionRequirements: { Se: 0.3, Si: 0.5, Ne: 0.3, Ni: 0.4, Te: 0.8, Ti: 0.4, Fe: 0.4, Fi: 0.2 },
    confidence: 3, sources: 'CAPT Data Bank: ESTJ/ENTJ 在项目管理; Myers 职业数据',
    matchReason: '高效执行(Te) + 流程管理(Si) + 团队协调(Fe)',
  },
  {
    title: '敏捷教练(Scrum Master)', category: '互联网/科技·项目管理',
    functionRequirements: { Se: 0.3, Si: 0.3, Ne: 0.4, Ni: 0.3, Te: 0.4, Ti: 0.3, Fe: 0.8, Fi: 0.3 },
    confidence: 2, sources: '行业数据: ENFJ/ESFJ 在教练角色中常见',
    matchReason: '团队赋能(Fe) + 系统思维(Te) + 灵活应变(Ne)',
  },

  /* ═══════════════════ FINANCE ═══════════════════ */

  {
    title: '行业研究员(证券)', category: '金融',
    functionRequirements: { Se: 0.2, Si: 0.5, Ne: 0.5, Ni: 0.7, Te: 0.6, Ti: 0.6, Fe: 0.1, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: INTJ/ISTJ 在金融研究; Myers 职业数据',
    matchReason: '深度行业洞察(Ni) + 逻辑分析(Ti) + 报告输出(Te)',
  },
  {
    title: '量化研究员', category: '金融',
    functionRequirements: { Se: 0.1, Si: 0.3, Ne: 0.6, Ni: 0.6, Te: 0.4, Ti: 0.9, Fe: 0.0, Fi: 0.0 },
    confidence: 3, sources: 'CAPT Data Bank: INTP/INTJ; arXiv:2504.17248: 金融科技领域 Ti/Ni 高',
    matchReason: '数学模型(Ti) + 策略发现(Ne) + 系统优化(Ni)',
  },
  {
    title: '投资经理', category: '金融',
    functionRequirements: { Se: 0.3, Si: 0.4, Ne: 0.5, Ni: 0.7, Te: 0.7, Ti: 0.5, Fe: 0.2, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: ENTJ/INTJ 在投资管理; Myers 职业数据',
    matchReason: '战略判断(Ni) + 果断决策(Te) + 机会识别(Ne)',
  },
  {
    title: '风险控制/风控工程师', category: '金融',
    functionRequirements: { Se: 0.3, Si: 0.7, Ne: 0.3, Ni: 0.5, Te: 0.6, Ti: 0.5, Fe: 0.1, Fi: 0.2 },
    confidence: 3, sources: 'CAPT Data Bank: ISTJ/INTJ 在风控; 行业数据',
    matchReason: '系统监控(Si) + 风险评估(Ni) + 规则执行(Te)',
  },
  {
    title: '交易员(股票/期货/外汇)', category: '金融',
    functionRequirements: { Se: 0.8, Si: 0.4, Ne: 0.3, Ni: 0.4, Te: 0.6, Ti: 0.5, Fe: 0.1, Fi: 0.2 },
    confidence: 3, sources: 'CAPT Data Bank: ESTP/ENTP 在交易; 中国 HR 数据: ESTP/ENTJ',
    matchReason: '快速反应(Se) + 果断决策(Te) + 风险计算(Ti)',
  },
  {
    title: '基金经理', category: '金融',
    functionRequirements: { Se: 0.2, Si: 0.4, Ne: 0.5, Ni: 0.8, Te: 0.7, Ti: 0.5, Fe: 0.1, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: INTJ/ENTJ 在基金管理',
    matchReason: '长期战略(Ni) + 资产配置(Te) + 市场洞察(Ne)',
  },
  {
    title: '保险精算师', category: '金融',
    functionRequirements: { Se: 0.1, Si: 0.8, Ne: 0.2, Ni: 0.3, Te: 0.5, Ti: 0.7, Fe: 0.1, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: ISTJ/INTJ 在精算; Myers 职业数据',
    matchReason: '精确计算(Ti) + 数据一致性(Si) + 结构化思维(Te)',
  },
  {
    title: '信贷审批师', category: '金融',
    functionRequirements: { Se: 0.2, Si: 0.8, Ne: 0.2, Ni: 0.3, Te: 0.6, Ti: 0.5, Fe: 0.1, Fi: 0.2 },
    confidence: 2, sources: 'CAPT Data Bank: ISTJ 在信贷/合规; 行业数据',
    matchReason: '规则遵循(Si) + 风险评估(Ni-Te) + 独立判断(Fi)',
  },
  {
    title: '合规官', category: '金融',
    functionRequirements: { Se: 0.1, Si: 0.9, Ne: 0.1, Ni: 0.2, Te: 0.6, Ti: 0.4, Fe: 0.1, Fi: 0.3 },
    confidence: 3, sources: 'CAPT Data Bank: ISTJ/ESTJ 在合规; 行业数据',
    matchReason: '法规细节(Si) + 客观执行(Te) + 道德底线(Fi)',
  },
  {
    title: '财务顾问(FA)', category: '金融',
    functionRequirements: { Se: 0.3, Si: 0.5, Ne: 0.4, Ni: 0.4, Te: 0.5, Ti: 0.5, Fe: 0.6, Fi: 0.3 },
    confidence: 2, sources: '行业数据: ENFJ/ESFJ 在财务顾问中常见',
    matchReason: '客户信任(Fe) + 财务规划(Te) + 个性化方案(Fi)',
  },

  /* ═══════════════════ CONSULTING / PROFESSIONAL SERVICES ═══════════════════ */

  {
    title: '管理咨询顾问', category: '咨询/专业服务',
    functionRequirements: { Se: 0.3, Si: 0.3, Ne: 0.5, Ni: 0.6, Te: 0.8, Ti: 0.5, Fe: 0.4, Fi: 0.2 },
    confidence: 3, sources: 'CAPT Data Bank: ENTJ/INTJ 在管理咨询; 行业数据',
    matchReason: '问题诊断(Ti-Ni) + 方案推进(Te) + 客户沟通(Fe)',
  },
  {
    title: '战略咨询顾问', category: '咨询/专业服务',
    functionRequirements: { Se: 0.2, Si: 0.3, Ne: 0.5, Ni: 0.8, Te: 0.7, Ti: 0.5, Fe: 0.3, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: INTJ/ENTJ 在战略咨询; 行业数据',
    matchReason: '战略视野(Ni) + 逻辑框架(Ti) + 高层沟通(Te)',
  },
  {
    title: '猎头顾问', category: '咨询/专业服务',
    functionRequirements: { Se: 0.4, Si: 0.3, Ne: 0.6, Ni: 0.3, Te: 0.5, Ti: 0.3, Fe: 0.7, Fi: 0.3 },
    confidence: 2, sources: '中国 HR 数据: ESTP/ENFP 在招聘线; 行业观察',
    matchReason: '人才洞察(Ne-Fe) + 关系维护(Fe) + 目标驱动(Te)',
  },
  {
    title: '人力资源顾问(HRBP)', category: '咨询/专业服务',
    functionRequirements: { Se: 0.3, Si: 0.4, Ne: 0.4, Ni: 0.4, Te: 0.5, Ti: 0.3, Fe: 0.8, Fi: 0.3 },
    confidence: 2, sources: '中国 HR 数据: ENTJ/ENFJ 在 HRBP 线; 行业观察',
    matchReason: '人际共情(Fe) + 业务理解(Te) + 组织诊断(Ni)',
  },
  {
    title: '企业培训师/OD', category: '咨询/专业服务',
    functionRequirements: { Se: 0.3, Si: 0.4, Ne: 0.5, Ni: 0.5, Te: 0.4, Ti: 0.4, Fe: 0.7, Fi: 0.3 },
    confidence: 2, sources: '中国 HR 数据: ENTJ/INTJ 在 OD 线; 行业数据',
    matchReason: '人员发展(Fe) + 体系设计(Ni-Te) + 表达感染(Se)',
  },

  /* ═══════════════════ HEALTHCARE ═══════════════════ */

  {
    title: '临床医生(内科)', category: '医疗健康',
    functionRequirements: { Se: 0.4, Si: 0.6, Ne: 0.4, Ni: 0.6, Te: 0.5, Ti: 0.6, Fe: 0.4, Fi: 0.3 },
    confidence: 3, sources: 'BMC Medical Education 2024: N&J 在医学过代表; Friedman & Slatt: 内科分布',
    matchReason: '临床推理(Ti-Ni) + 经验积累(Si) + 患者沟通(Fe)',
  },
  {
    title: '外科医生', category: '医疗健康',
    functionRequirements: { Se: 0.9, Si: 0.5, Ne: 0.2, Ni: 0.4, Te: 0.6, Ti: 0.6, Fe: 0.2, Fi: 0.2 },
    confidence: 3, sources: 'CAPT Data Bank: ISTP/ESTP 外科过代表; Friedman & Slatt: STJ 妇产科',
    matchReason: '手眼精准(Se) + 即时判断(Ti) + 冷静执行(Te)',
  },
  {
    title: '精神科医生', category: '医疗健康',
    functionRequirements: { Se: 0.2, Si: 0.3, Ne: 0.5, Ni: 0.8, Te: 0.3, Ti: 0.5, Fe: 0.6, Fi: 0.5 },
    confidence: 3, sources: 'Friedman & Slatt 1988: 精神科 NFP 过代表; 行业数据',
    matchReason: '深层心理洞察(Ni-Fi) + 治疗共情(Fe) + 理论整合(Ne)',
  },
  {
    title: '心理咨询师/治疗师', category: '医疗健康',
    functionRequirements: { Se: 0.2, Si: 0.3, Ne: 0.4, Ni: 0.7, Te: 0.2, Ti: 0.4, Fe: 0.7, Fi: 0.7 },
    confidence: 3, sources: 'CAPT Data Bank: INFJ/INFP/ENFJ 在心理咨询; 行业数据',
    matchReason: '共情理解(Fe-Fi) + 深度洞察(Ni) + 人本关怀(Fi)',
  },
  {
    title: '药剂师', category: '医疗健康',
    functionRequirements: { Se: 0.3, Si: 0.9, Ne: 0.1, Ni: 0.2, Te: 0.5, Ti: 0.5, Fe: 0.2, Fi: 0.2 },
    confidence: 3, sources: 'CAPT Data Bank: ISTJ 在药剂学高比例; 行业数据',
    matchReason: '精确配药(Si) + 药物知识(Ti) + 规则执行(Te)',
  },
  {
    title: '医学研究员(临床研究)', category: '医疗健康',
    functionRequirements: { Se: 0.2, Si: 0.5, Ne: 0.4, Ni: 0.6, Te: 0.5, Ti: 0.6, Fe: 0.1, Fi: 0.2 },
    confidence: 3, sources: 'BMC Medical Education 2024; CAPT Data Bank: INTJ/INTP',
    matchReason: '研究假设(Ni-Ne) + 数据分析(Ti) + 规范执行(Si)',
  },
  {
    title: '康复治疗师', category: '医疗健康',
    functionRequirements: { Se: 0.6, Si: 0.5, Ne: 0.3, Ni: 0.3, Te: 0.4, Ti: 0.4, Fe: 0.6, Fi: 0.3 },
    confidence: 2, sources: '行业数据: ISFJ/ESFJ 在康复治疗中常见',
    matchReason: '身体操作(Se) + 患者鼓励(Fe) + 进步追踪(Si)',
  },

  /* ═══════════════════ EDUCATION / ACADEMIA ═══════════════════ */

  {
    title: 'K12 教师', category: '教育/学术',
    functionRequirements: { Se: 0.3, Si: 0.6, Ne: 0.4, Ni: 0.3, Te: 0.4, Ti: 0.3, Fe: 0.7, Fi: 0.4 },
    confidence: 3, sources: 'CAPT Data Bank: ESFJ 在教育中最高频; ENFP 第三; Myers 职业数据',
    matchReason: '关爱学生(Fe) + 结构教学(Si) + 创造力(Ne)',
  },
  {
    title: '大学教授/讲师', category: '教育/学术',
    functionRequirements: { Se: 0.2, Si: 0.4, Ne: 0.5, Ni: 0.7, Te: 0.5, Ti: 0.7, Fe: 0.3, Fi: 0.2 },
    confidence: 3, sources: 'CAPT Data Bank: INTJ/INTP 在高等教育; Myers 职业数据',
    matchReason: '深度研究(Ni-Ti) + 知识传递(Te) + 学术探索(Ne)',
  },
  {
    title: '教学设计师(教育产品)', category: '教育/学术',
    functionRequirements: { Se: 0.3, Si: 0.4, Ne: 0.6, Ni: 0.5, Te: 0.4, Ti: 0.5, Fe: 0.5, Fi: 0.3 },
    confidence: 2, sources: '行业数据: INFP/ENFP 在教育设计; O*NET 教学设计师',
    matchReason: '学习体验设计(Ne) + 用户共情(Fe) + 逻辑结构(Ti)',
  },
  {
    title: '职业规划师', category: '教育/学术',
    functionRequirements: { Se: 0.2, Si: 0.4, Ne: 0.5, Ni: 0.6, Te: 0.3, Ti: 0.4, Fe: 0.6, Fi: 0.6 },
    confidence: 2, sources: '行业数据: INFJ/ENFJ 在生涯规划中常见',
    matchReason: '洞察人生方向(Ni-Fi) + 人际引导(Fe) + 可能探索(Ne)',
  },
  {
    title: '科研人员(基础研究)', category: '教育/学术',
    functionRequirements: { Se: 0.2, Si: 0.3, Ne: 0.6, Ni: 0.7, Te: 0.3, Ti: 0.8, Fe: 0.1, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: INTP/INTJ 在科研领域显著过代表',
    matchReason: '理论构建(Ti-Ne) + 深度专注(Ni) + 严谨验证(Si)',
  },

  /* ═══════════════════ CREATIVE / MEDIA ═══════════════════ */

  {
    title: '品牌策划师', category: '创意/传媒',
    functionRequirements: { Se: 0.4, Si: 0.3, Ne: 0.7, Ni: 0.5, Te: 0.4, Ti: 0.3, Fe: 0.5, Fi: 0.4 },
    confidence: 2, sources: '行业数据: ENTP/ENFP 在品牌策划中常见',
    matchReason: '创意策略(Ne) + 消费者洞察(Fe) + 差异化定位(Fi)',
  },
  {
    title: '广告创意总监', category: '创意/传媒',
    functionRequirements: { Se: 0.5, Si: 0.2, Ne: 0.8, Ni: 0.4, Te: 0.5, Ti: 0.3, Fe: 0.4, Fi: 0.4 },
    confidence: 2, sources: '行业数据: ENTP/ENFP 在广告创意; 中国 HR 数据',
    matchReason: '创意发散(Ne) + 视觉把控(Se) + 团队领导(Te)',
  },
  {
    title: '内容策略师', category: '创意/传媒',
    functionRequirements: { Se: 0.3, Si: 0.3, Ne: 0.7, Ni: 0.5, Te: 0.5, Ti: 0.4, Fe: 0.4, Fi: 0.4 },
    confidence: 2, sources: '行业数据: INTJ/ENTP 在内容策略; O*NET 内容策略师',
    matchReason: '内容规划(Ni-Ne) + 受众理解(Fe) + 执行力(Te)',
  },
  {
    title: '视频编导', category: '创意/传媒',
    functionRequirements: { Se: 0.7, Si: 0.3, Ne: 0.6, Ni: 0.4, Te: 0.4, Ti: 0.3, Fe: 0.4, Fi: 0.5 },
    confidence: 2, sources: '行业数据: ISFP/ENFP 在影视创作中常见',
    matchReason: '视觉叙事(Se-Fi) + 创意构思(Ne) + 团队协调(Fe)',
  },
  {
    title: '短视频运营', category: '创意/传媒',
    functionRequirements: { Se: 0.7, Si: 0.3, Ne: 0.6, Ni: 0.3, Te: 0.5, Ti: 0.2, Fe: 0.5, Fi: 0.3 },
    confidence: 2, sources: '新兴岗位，行业观察: 需要网感 + 数据敏感',
    matchReason: '热点捕捉(Se-Ne) + 用户共鸣(Fe) + 数据优化(Te)',
  },
  {
    title: '出版编辑', category: '创意/传媒',
    functionRequirements: { Se: 0.2, Si: 0.7, Ne: 0.3, Ni: 0.4, Te: 0.5, Ti: 0.5, Fe: 0.3, Fi: 0.4 },
    confidence: 3, sources: 'CAPT Data Bank: ISTJ/INTJ 在出版编辑; 行业数据',
    matchReason: '文字审校(Si) + 逻辑审查(Ti) + 品质判断(Fi)',
  },

  /* ═══════════════════ LAW / PUBLIC ═══════════════════ */

  {
    title: '诉讼律师', category: '法律/公共',
    functionRequirements: { Se: 0.4, Si: 0.5, Ne: 0.5, Ni: 0.4, Te: 0.7, Ti: 0.6, Fe: 0.3, Fi: 0.2 },
    confidence: 3, sources: 'CAPT Data Bank: ENTJ/ESTJ 在法律; Gilchrist 1991: TJ 过代表',
    matchReason: '逻辑辩论(Ti-Te) + 证据梳理(Si) + 当庭应对(Se)',
  },
  {
    title: '非诉律师(公司法务)', category: '法律/公共',
    functionRequirements: { Se: 0.1, Si: 0.8, Ne: 0.3, Ni: 0.3, Te: 0.6, Ti: 0.5, Fe: 0.2, Fi: 0.3 },
    confidence: 3, sources: 'CAPT Data Bank: ISTJ/INTJ 在公司法务; 行业数据',
    matchReason: '法条检索(Si) + 风险分析(Ni) + 文件管理(Te)',
  },
  {
    title: '知识产权顾问', category: '法律/公共',
    functionRequirements: { Se: 0.2, Si: 0.8, Ne: 0.3, Ni: 0.3, Te: 0.5, Ti: 0.6, Fe: 0.2, Fi: 0.2 },
    confidence: 2, sources: 'CAPT Data Bank: ISTJ/INTJ 在知识产权; 行业数据',
    matchReason: '专利分析(Ti) + 细节管理(Si) + 法律框架(Te)',
  },
  {
    title: '公务员', category: '法律/公共',
    functionRequirements: { Se: 0.2, Si: 0.8, Ne: 0.2, Ni: 0.3, Te: 0.6, Ti: 0.3, Fe: 0.4, Fi: 0.3 },
    confidence: 2, sources: 'CAPT Data Bank: ISTJ/ESTJ 在政府管理; 行业观察',
    matchReason: '程序遵循(Si) + 公共服务(Fe) + 行政执行(Te)',
  },
  {
    title: '政策研究员', category: '法律/公共',
    functionRequirements: { Se: 0.1, Si: 0.5, Ne: 0.5, Ni: 0.7, Te: 0.5, Ti: 0.6, Fe: 0.2, Fi: 0.2 },
    confidence: 2, sources: '行业数据: INTJ/INTP 在政策研究; Myers 职业数据',
    matchReason: '政策分析(Ni-Ti) + 影响评估(Ne) + 报告输出(Te)',
  },
  {
    title: 'NGO 项目官员', category: '法律/公共',
    functionRequirements: { Se: 0.2, Si: 0.4, Ne: 0.4, Ni: 0.5, Te: 0.4, Ti: 0.3, Fe: 0.7, Fi: 0.6 },
    confidence: 2, sources: '行业数据: INFJ/ENFJ/INFP 在 NGO; Myers 职业数据',
    matchReason: '价值使命(Fi) + 社会共情(Fe) + 项目执行(Te)',
  },

  /* ═══════════════════ ENGINEERING / MANUFACTURING ═══════════════════ */

  {
    title: '结构工程师', category: '工程/制造',
    functionRequirements: { Se: 0.4, Si: 0.6, Ne: 0.2, Ni: 0.3, Te: 0.6, Ti: 0.6, Fe: 0.1, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: ISTJ/ISTP 在工程; Myers 职业数据',
    matchReason: '结构计算(Ti) + 规范执行(Si) + 可施工性(Se)',
  },
  {
    title: '质量工程师(QA/QC)', category: '工程/制造',
    functionRequirements: { Se: 0.4, Si: 0.8, Ne: 0.1, Ni: 0.2, Te: 0.6, Ti: 0.4, Fe: 0.1, Fi: 0.2 },
    confidence: 3, sources: 'CAPT Data Bank: ISTJ 在质量管理; 行业数据',
    matchReason: '标准执行(Si) + 偏差检测(Se) + 流程控制(Te)',
  },
  {
    title: '供应链经理', category: '工程/制造',
    functionRequirements: { Se: 0.3, Si: 0.6, Ne: 0.3, Ni: 0.4, Te: 0.8, Ti: 0.4, Fe: 0.3, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: ESTJ/ISTJ 在供应链; 行业数据',
    matchReason: '全局调度(Te) + 流程优化(Si) + 供应商管理(Fe)',
  },
  {
    title: '电气工程师', category: '工程/制造',
    functionRequirements: { Se: 0.5, Si: 0.5, Ne: 0.2, Ni: 0.3, Te: 0.5, Ti: 0.7, Fe: 0.1, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: ISTP/INTP 在电气工程; 行业数据',
    matchReason: '电路分析(Ti) + 动手调试(Se) + 规范设计(Si)',
  },
  {
    title: '项目经理(工程)', category: '工程/制造',
    functionRequirements: { Se: 0.4, Si: 0.5, Ne: 0.3, Ni: 0.4, Te: 0.9, Ti: 0.3, Fe: 0.3, Fi: 0.1 },
    confidence: 3, sources: 'CAPT Data Bank: ESTJ 在项目管理; 行业数据',
    matchReason: '工程推进(Te) + 进度控制(Si) + 多方协调(Fe)',
  },

  /* ═══════════════════ SALES / BUSINESS ═══════════════════ */

  {
    title: '大客户销售(B2B)', category: '销售/商务',
    functionRequirements: { Se: 0.5, Si: 0.3, Ne: 0.5, Ni: 0.4, Te: 0.7, Ti: 0.3, Fe: 0.6, Fi: 0.2 },
    confidence: 3, sources: 'CAPT Data Bank: E 偏好 72%, T 偏好 82% 在销售; ESTJ/ENTJ 占最高',
    matchReason: '关系建立(Fe) + 目标达成(Te) + 需求洞察(Ne)',
  },
  {
    title: '解决方案顾问(Presales)', category: '销售/商务',
    functionRequirements: { Se: 0.4, Si: 0.3, Ne: 0.6, Ni: 0.5, Te: 0.6, Ti: 0.5, Fe: 0.5, Fi: 0.2 },
    confidence: 2, sources: '行业数据: ENTP/ENTJ 在售前顾问; 中国 HR 实践',
    matchReason: '技术理解(Ti) + 方案定制(Ne) + 客户演示(Fe-Se)',
  },
  {
    title: '商务拓展(BD)', category: '销售/商务',
    functionRequirements: { Se: 0.5, Si: 0.3, Ne: 0.7, Ni: 0.4, Te: 0.6, Ti: 0.3, Fe: 0.5, Fi: 0.2 },
    confidence: 2, sources: '行业数据: ENTP/ENTJ 在 BD; 青山资本 2024: E人平台型创业',
    matchReason: '机会发现(Ne) + 合作谈判(Te-Fe) + 市场感知(Se)',
  },
  {
    title: '客户成功经理(CSM)', category: '销售/商务',
    functionRequirements: { Se: 0.3, Si: 0.4, Ne: 0.3, Ni: 0.3, Te: 0.5, Ti: 0.3, Fe: 0.8, Fi: 0.3 },
    confidence: 2, sources: '行业数据: ESFJ/ENFJ 在客户成功; 中国 HR 实践',
    matchReason: '客户关系(Fe) + 续费管理(Te) + 产品洞察(Si)',
  },
  {
    title: '渠道管理', category: '销售/商务',
    functionRequirements: { Se: 0.4, Si: 0.5, Ne: 0.4, Ni: 0.3, Te: 0.7, Ti: 0.3, Fe: 0.5, Fi: 0.2 },
    confidence: 2, sources: '行业数据: ESTJ/ENTJ 在渠道管理; 中国 HR 实践',
    matchReason: '渠道建设(Te) + 伙伴关系(Fe) + 市场拓展(Ne)',
  },

  /* ═══════════════════ HR / ADMIN ═══════════════════ */

  {
    title: '招聘专员', category: '人力资源/行政',
    functionRequirements: { Se: 0.4, Si: 0.4, Ne: 0.5, Ni: 0.3, Te: 0.5, Ti: 0.2, Fe: 0.7, Fi: 0.3 },
    confidence: 2, sources: '中国 HR 数据: ESTP/ENFP 在招聘线; 行业实践',
    matchReason: '人才判断(Ne-Fe) + 沟通执行(Te) + 关系维护(Fe)',
  },
  {
    title: '薪酬福利经理(C&B)', category: '人力资源/行政',
    functionRequirements: { Se: 0.1, Si: 0.8, Ne: 0.2, Ni: 0.3, Te: 0.7, Ti: 0.5, Fe: 0.2, Fi: 0.2 },
    confidence: 2, sources: '中国 HR 数据: ISTJ/INTJ 在薪酬绩效线; 行业实践',
    matchReason: '数据分析(Ti-Si) + 体系设计(Te) + 公平判断(Fi)',
  },
  {
    title: '组织发展(OD)', category: '人力资源/行政',
    functionRequirements: { Se: 0.2, Si: 0.3, Ne: 0.5, Ni: 0.6, Te: 0.5, Ti: 0.4, Fe: 0.6, Fi: 0.3 },
    confidence: 2, sources: '中国 HR 数据: ENTJ/INTJ 在 OD 线; 行业实践',
    matchReason: '组织诊断(Ni) + 变革推动(Te) + 人员赋能(Fe)',
  },
  {
    title: '行政管理', category: '人力资源/行政',
    functionRequirements: { Se: 0.3, Si: 0.8, Ne: 0.2, Ni: 0.2, Te: 0.6, Ti: 0.2, Fe: 0.4, Fi: 0.2 },
    confidence: 2, sources: 'CAPT Data Bank: ISTJ/ESFJ 在行政; 行业数据',
    matchReason: '事务管理(Si) + 高效执行(Te) + 服务意识(Fe)',
  },

  /* ═══════════════════ EMERGING FIELDS ═══════════════════ */

  {
    title: 'ESG 分析师', category: '新兴领域',
    functionRequirements: { Se: 0.2, Si: 0.5, Ne: 0.5, Ni: 0.5, Te: 0.5, Ti: 0.5, Fe: 0.4, Fi: 0.5 },
    confidence: 1, sources: '新兴岗位，基于 ESG 工作特性推导：数据分析+价值观判断+沟通',
    matchReason: 'ESG 评估(Ti-Te) + 价值判断(Fi) + 报告撰写(Si)',
  },
  {
    title: 'AI 训练师/提示词工程师', category: '新兴领域',
    functionRequirements: { Se: 0.2, Si: 0.3, Ne: 0.8, Ni: 0.5, Te: 0.4, Ti: 0.6, Fe: 0.2, Fi: 0.1 },
    confidence: 1, sources: '2025 新兴岗位; 基于工作特性：需要语言逻辑+创造性+精确性',
    matchReason: '语言创造力(Ne) + 逻辑精确(Ti) + 效果迭代(Te)',
  },
  {
    title: '自媒体博主', category: '新兴领域',
    functionRequirements: { Se: 0.6, Si: 0.3, Ne: 0.7, Ni: 0.3, Te: 0.4, Ti: 0.2, Fe: 0.5, Fi: 0.5 },
    confidence: 1, sources: '新兴职业; 基于工作特性：内容创意+个人表达+粉丝运营',
    matchReason: '内容创意(Ne-Fi) + 视觉呈现(Se) + 粉丝互动(Fe)',
  },
  {
    title: 'Web3/区块链开发', category: '新兴领域',
    functionRequirements: { Se: 0.2, Si: 0.3, Ne: 0.6, Ni: 0.6, Te: 0.3, Ti: 0.8, Fe: 0.1, Fi: 0.1 },
    confidence: 1, sources: '新兴岗位; 基于技术特性+行业观察',
    matchReason: '密码学/共识算法(Ti) + 去中心化思维(Ne) + 系统安全(Ni)',
  },
  {
    title: '碳中和顾问', category: '新兴领域',
    functionRequirements: { Se: 0.2, Si: 0.6, Ne: 0.4, Ni: 0.5, Te: 0.6, Ti: 0.5, Fe: 0.3, Fi: 0.3 },
    confidence: 1, sources: '双碳政策催生的新岗位; 基于工作特性推导',
    matchReason: '碳核算(Si-Te) + 方案设计(Ni) + 政策理解(Ne)',
  },
];
