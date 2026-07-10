import type { CSSProperties } from 'react';
import type {
  PreferenceDimension,
  V2AssessmentResult,
  V2FinaleChoice,
  V2QualityGrade,
} from '../../types';
import './v2.css';

export type V2ResearchStatus =
  | 'idle'
  | 'submitting'
  | 'submitted'
  | 'queued'
  | 'failed';

export interface V2ResultViewProps {
  result: V2AssessmentResult;
  /** Narrative ending copy; null when the session has no recorded ending. */
  ending: V2FinaleChoice | null;
  onRestart: () => void;
  onHome: () => void;
  onResearchConsent: () => void;
  researchStatus?: V2ResearchStatus;
}

const DIMENSION_ORDER: PreferenceDimension[] = ['EI', 'SN', 'TF', 'JP'];

const DIMENSION_NAMES: Record<PreferenceDimension, string> = {
  EI: '能量与交流',
  SN: '信息与注意',
  TF: '判断与取舍',
  JP: '节奏与应对',
};

const QUALITY_COPY: Record<
  V2QualityGrade,
  { eyebrow: string; title: string; body: string }
> = {
  high: {
    eyebrow: '作答质量 · 良好',
    title: '这份结果可以作为一次清晰的偏好快照',
    body: '作答完整，节奏与前后一致性未见明显异常。仍建议结合你的真实经历自行确认。',
  },
  medium: {
    eyebrow: '作答质量 · 可参考',
    title: '大方向可读，细微差异需要保留余地',
    body: '部分质量信号不足或未测量，因此相近类型之间不宜下过强结论。',
  },
  low: {
    eyebrow: '作答质量 · 谨慎解读',
    title: '本次结果可能受节奏或情境理解影响',
    body: '先阅读四个维度，再判断它是否符合你长期、自然的行为方式。',
  },
  insufficient: {
    eyebrow: '作答质量 · 信息不足',
    title: '本次不适合给出确定类型',
    body: '下面仅保留暂定候选供查看。重新完成一次，比把不完整答案包装成结论更有意义。',
  },
};

const FUNCTION_LABELS: Record<string, { name: string; description: string }> = {
  Se: { name: '外倾感觉', description: '留意眼前正在发生的事实与行动机会' },
  Si: { name: '内倾感觉', description: '借助经验、细节与熟悉参照理解当下' },
  Ne: { name: '外倾直觉', description: '展开联想，探索事物之间的多种可能' },
  Ni: { name: '内倾直觉', description: '收拢线索，寻找背后的模式与走向' },
  Te: { name: '外倾思维', description: '用可执行的结构、标准与结果推进事情' },
  Ti: { name: '内倾思维', description: '检查概念与逻辑是否准确、自洽' },
  Fe: { name: '外倾情感', description: '关注互动气氛、共同需要与关系影响' },
  Fi: { name: '内倾情感', description: '依据个人价值与真实感受作出判断' },
};

const STACK_POSITIONS = ['主导', '辅助', '第三', '劣势'];

const QUALITY_FLAG_LABELS: Record<string, string> = {
  'assessment-incomplete': '没有完成全部测量决策',
  'invalid-response-data': '本次答案记录无法完整验证',
  'attention-not-measured': '自然注意检查暂未测量',
  'attention-check-missed': '自然注意检查未全部通过',
  'response-time-missing': '部分作答时长没有被记录',
  'many-fast-responses': '多次作答时间明显偏短',
  'consistency-not-measured': '一致性证据暂未测量',
  'consistency-evidence-limited': '可比较的一致性题对较少',
  'low-declared-consistency': '相似情境的选择存在较大波动',
};

const WORK_PREFERENCES: Record<
  string,
  { environment: string; task: string }
> = {
  E: {
    environment: '可以及时交换想法、在互动中澄清信息',
    task: '通过讨论、连接人与资源来推动协作',
  },
  I: {
    environment: '留有连续专注和独立消化信息的时间',
    task: '深度整理材料，并形成完整、经过思考的观点',
  },
  S: {
    environment: '事实、标准和反馈相对清楚，能看见具体进展',
    task: '处理细节、现实限制与可以被验证的问题',
  },
  N: {
    environment: '允许探索关联、长期方向和新的可能',
    task: '发现模式、提出假设并构想替代方案',
  },
  T: {
    environment: '决策依据透明，可以坦率讨论原则与取舍',
    task: '拆解逻辑、比较方案并处理资源配置',
  },
  F: {
    environment: '重视人的影响、价值共识与关系质量',
    task: '理解需要、协调期待并改善他人的体验',
  },
  J: {
    environment: '目标、节点和责任边界相对明确',
    task: '制定计划、收束事项并维持稳定交付',
  },
  P: {
    environment: '保留调整路径和响应新信息的空间',
    task: '探索选项、快速试验并适应变化中的条件',
  },
};

function clampScore(score: number) {
  return Math.max(-100, Math.min(100, score));
}

function dimensionSummary(
  score: number,
  band: 'balanced' | 'leaning' | 'clear',
  negativePole: string,
  positivePole: string,
) {
  if (band === 'balanced') return `${negativePole} 与 ${positivePole} 相对均衡`;
  const pole = score < 0 ? negativePole : positivePole;
  return band === 'clear' ? `明显倾向 ${pole}` : `倾向 ${pole}`;
}

function flagLabel(flag: string) {
  return QUALITY_FLAG_LABELS[flag] ?? flag.replaceAll('-', ' ').replaceAll('_', ' ');
}

function researchButtonCopy(status: V2ResearchStatus) {
  if (status === 'submitting') return '正在匿名提交…';
  if (status === 'submitted') return '已提交，感谢参与';
  if (status === 'queued') return '已保存，联网后自动提交';
  if (status === 'failed') return '重新尝试匿名提交';
  return '我已满 18 岁，同意匿名提交';
}

export default function V2ResultView({
  result,
  ending,
  onRestart,
  onHome,
  onResearchConsent,
  researchStatus = 'idle',
}: V2ResultViewProps) {
  const qualityCopy = QUALITY_COPY[result.quality.grade];
  const alternativeCandidates = result.candidates.filter(
    (candidate) => candidate !== result.bestFitType,
  );
  const workPreferences = result.bestFitType
    .split('')
    .map((letter) => WORK_PREFERENCES[letter])
    .filter((preference): preference is { environment: string; task: string } => Boolean(preference));

  const attentionLabel =
    result.quality.attentionTotal === 0
      ? '未设置'
      : `${result.quality.attentionCorrect} / ${result.quality.attentionTotal} 通过`;
  const paceLabel =
    result.quality.fastResponseRatio > 0.2
      ? '多次偏快'
      : result.quality.fastResponseRatio > 0.05
        ? '少量偏快'
        : '节奏稳定';
  const consistencyLabel =
    result.quality.consistencyScore === null
      ? '未测量'
      : result.quality.consistencyScore >= 0.7
        ? '较稳定'
        : result.quality.consistencyScore >= 0.45
          ? '有波动'
          : '波动明显';

  return (
    <main className="mbti-v2 v2-result">
      <header
        className="v2-result__quality"
        data-grade={result.quality.grade}
        aria-labelledby="v2-quality-title"
      >
        <div className="v2-result__quality-mark" aria-hidden="true">
          {result.quality.grade === 'high'
            ? 'A'
            : result.quality.grade === 'medium'
              ? 'B'
              : result.quality.grade === 'low'
                ? 'C'
                : '—'}
        </div>
        <div className="v2-result__quality-copy">
          <p>{qualityCopy.eyebrow}</p>
          <h1 id="v2-quality-title">{qualityCopy.title}</h1>
          <span>{qualityCopy.body}</span>
        </div>
        <dl className="v2-result__quality-signals">
          <div>
            <dt>注意检查</dt>
            <dd>{attentionLabel}</dd>
          </div>
          <div>
            <dt>作答节奏</dt>
            <dd>{paceLabel}</dd>
          </div>
          <div>
            <dt>前后一致</dt>
            <dd>{consistencyLabel}</dd>
          </div>
        </dl>
      </header>

      <div className="v2-result__shell">
        <nav className="v2-result__nav" aria-label="结果页操作">
          <button type="button" onClick={onHome} className="v2-text-button">
            ← 回到首页
          </button>
          <span>《十九点二十分》· 偏好探索报告</span>
          <button type="button" onClick={onRestart} className="v2-text-button">
            重新走一遍
          </button>
        </nav>

        <section className="v2-result__hero" aria-labelledby="v2-candidate-title">
          <div className="v2-result__hero-main">
            <p className="v2-result__eyebrow">
              {result.quality.grade === 'insufficient' ? '暂定候选' : '最佳拟合候选'}
            </p>
            <div className="v2-result__candidate-line">
              <h2 id="v2-candidate-title">{result.bestFitType}</h2>
              <span>待你确认</span>
            </div>
            <p className="v2-result__candidate-note">
              它是四组连续偏好共同指向的候选，不是对能力、人格价值或未来表现的判决。
            </p>

            {(result.uncertainDimensions.length > 0 || alternativeCandidates.length > 0) && (
              <div className="v2-result__uncertainty">
                <p>保留的不确定性</p>
                {result.uncertainDimensions.length > 0 && (
                  <span>
                    {result.uncertainDimensions
                      .map((dimension) => DIMENSION_NAMES[dimension])
                      .join('、')}
                    接近中线
                  </span>
                )}
                {alternativeCandidates.length > 0 && (
                  <div className="v2-result__candidate-chips" aria-label="相邻候选类型">
                    {alternativeCandidates.map((candidate) => (
                      <span key={candidate}>{candidate}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="v2-result__ending" aria-labelledby="v2-ending-title">
            <p>雨夜结局 · 与类型无关</p>
            {ending ? (
              <>
                <h3 id="v2-ending-title">{ending.title}</h3>
                <blockquote>{ending.endingText}</blockquote>
              </>
            ) : (
              <>
                <h3 id="v2-ending-title">未记录剧情结局</h3>
                <blockquote>这次会话没有保存最后的落笔选择；测量结果仍然有效。</blockquote>
              </>
            )}
          </aside>
        </section>

        {result.quality.flags.length > 0 && (
          <aside className="v2-result__flags" aria-label="作答质量提醒">
            <span>阅读前请留意</span>
            <ul>
              {result.quality.flags.map((flag) => (
                <li key={flag}>{flagLabel(flag)}</li>
              ))}
            </ul>
          </aside>
        )}

        <section className="v2-result__section" aria-labelledby="v2-dimensions-title">
          <div className="v2-result__section-heading">
            <p>01 / 连续偏好</p>
            <div>
              <h2 id="v2-dimensions-title">四组倾向，不是四道分界线</h2>
              <span>位置越靠近中央，说明两侧越可能随情境切换。</span>
            </div>
          </div>

          <div className="v2-result__spectra">
            {DIMENSION_ORDER.map((dimension) => {
              const dimensionResult = result.dimensionScores[dimension];
              const position = (clampScore(dimensionResult.score) + 100) / 2;
              const summary = dimensionSummary(
                dimensionResult.score,
                dimensionResult.band,
                dimensionResult.negativePole,
                dimensionResult.positivePole,
              );

              return (
                <article className="v2-spectrum" key={dimension}>
                  <div className="v2-spectrum__heading">
                    <span>{DIMENSION_NAMES[dimension]}</span>
                    <strong>{summary}</strong>
                  </div>
                  <div
                    className="v2-spectrum__axis"
                    style={{ '--v2-axis-position': `${position}%` } as CSSProperties}
                    role="img"
                    aria-label={`${DIMENSION_NAMES[dimension]}：${summary}`}
                  >
                    <div className="v2-spectrum__half v2-spectrum__half--negative" />
                    <div className="v2-spectrum__half v2-spectrum__half--positive" />
                    <span className="v2-spectrum__midpoint" />
                    <span className="v2-spectrum__marker" />
                  </div>
                  <div className="v2-spectrum__poles" aria-hidden="true">
                    <span>{dimensionResult.negativePole}</span>
                    <span>{dimensionResult.positivePole}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="v2-result__section" aria-labelledby="v2-functions-title">
          <div className="v2-result__section-heading">
            <p>02 / 理论视角</p>
            <div>
              <h2 id="v2-functions-title">{result.bestFitType} 的认知功能序列</h2>
              <span>由候选类型推导，并非八项功能的直接测量结果。</span>
            </div>
          </div>

          <ol className="v2-result__function-stack">
            {result.functionStack.map((functionCode, index) => {
              const functionInfo = FUNCTION_LABELS[functionCode] ?? {
                name: functionCode,
                description: '该功能用于提供类型理论中的解释视角',
              };
              return (
                <li key={`${functionCode}-${index}`}>
                  <span className="v2-result__function-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p>{STACK_POSITIONS[index] ?? `第 ${index + 1} 位`}</p>
                    <h3>
                      {functionCode} · {functionInfo.name}
                    </h3>
                    <span>{functionInfo.description}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="v2-result__section" aria-labelledby="v2-work-title">
          <div className="v2-result__section-heading">
            <p>03 / 工作方式</p>
            <div>
              <h2 id="v2-work-title">你可能更舒服的环境与任务</h2>
              <span>偏好不等于能力，也不应用来筛选岗位或限制职业选择。</span>
            </div>
          </div>

          <div className="v2-result__work-grid">
            <article>
              <h3>环境线索</h3>
              <ul>
                {workPreferences.map((preference) => (
                  <li key={preference.environment}>{preference.environment}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>任务方式</h3>
              <ul>
                {workPreferences.map((preference) => (
                  <li key={preference.task}>{preference.task}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="v2-result__section v2-result__limits" aria-labelledby="v2-limits-title">
          <div className="v2-result__section-heading">
            <p>04 / 使用边界</p>
            <div>
              <h2 id="v2-limits-title">把结果当作一面镜子，不是一张身份证</h2>
              <span>它适合开启自我观察，不适合替代专业判断。</span>
            </div>
          </div>
          <ul>
            <li>本测评不评估智力、能力、心理健康，也不能用于招聘或临床决策。</li>
            <li>类型候选来自本次情境选择；状态、语言理解与生活阶段都会影响结果。</li>
            <li>当维度接近中线时，相邻候选同样值得阅读，你对长期行为的判断更重要。</li>
            <li>认知功能序列属于类型理论解释，不代表已分别测量八项功能。</li>
          </ul>
        </section>

        <section className="v2-result__research" aria-labelledby="v2-research-title">
          <div>
            <p>帮助我们验证，而不是先宣称准确</p>
            <h2 id="v2-research-title">愿意匿名贡献这次作答吗？</h2>
            <span>
              仅限已满 18 岁且自愿参与。提交内容包含版本、选项顺序、响应时长与质量信号，
              不含姓名、邮箱或账号信息。
            </span>
          </div>
          <button
            type="button"
            className="v2-button v2-button--research"
            onClick={onResearchConsent}
            disabled={
              researchStatus === 'submitting' ||
              researchStatus === 'submitted' ||
              researchStatus === 'queued'
            }
          >
            {researchButtonCopy(researchStatus)}
          </button>
          {researchStatus === 'failed' && (
            <p className="v2-result__research-error" role="alert">
              刚才没有提交成功。本地结果仍然保留，你可以稍后重试。
            </p>
          )}
        </section>

        <footer className="v2-result__footer">
          <p>这份报告描述偏好，不定义你。</p>
          <div>
            <button type="button" onClick={onHome} className="v2-text-button">
              回到首页
            </button>
            <button type="button" onClick={onRestart} className="v2-button v2-button--dark">
              重新开始夜班
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
