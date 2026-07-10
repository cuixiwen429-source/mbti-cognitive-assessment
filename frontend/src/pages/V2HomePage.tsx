import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { V2_ASSESSMENT, V2_ITEMS } from '../data/v2Assessment';
import { useV2TestStore } from '../store/v2TestStore';
import { retryQueuedResearch } from '../utils/researchSubmission';
import '../components/v2/v2.css';

const TYPE_NAMES: Record<string, string> = {
  INTJ: '建筑师', INTP: '逻辑学家', INFJ: '提倡者', INFP: '调停者',
  ISTJ: '物流师', ISFJ: '守卫者', ISTP: '鉴赏家', ISFP: '探险家',
  ENTJ: '指挥官', ENTP: '辩论家', ENFJ: '主人公', ENFP: '竞选者',
  ESTJ: '总经理', ESFJ: '执政官', ESTP: '企业家', ESFP: '表演者',
};

const TOTAL_ITEMS = V2_ITEMS.length;

export default function V2HomePage() {
  const navigate = useNavigate();
  const { hydrated, draft, history, hydrate, startNew, discardDraft } = useV2TestStore();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrate, hydrated]);

  useEffect(() => {
    const retry = () => { void retryQueuedResearch(); };
    retry();
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, []);

  const begin = () => {
    startNew();
    navigate('/test');
  };

  const restart = () => {
    discardDraft();
    begin();
  };

  const progress = draft
    ? Math.round((draft.responses.length / Math.max(1, TOTAL_ITEMS)) * 100)
    : 0;

  return (
    <main className="v2-home">
      <div className="v2-home__image" aria-hidden="true" />
      <div className="v2-home__veil" aria-hidden="true" />

      <section className="v2-home__content">
        <div className="v2-home__eyebrow">
          <span>剧情式人格偏好探索</span>
          <span>V2 BETA</span>
        </div>

        <div className="v2-home__hero">
          <p className="v2-home__time">雨夜 · 18:00 · 市立医院</p>
          <h1>{V2_ASSESSMENT.title}</h1>
          <p className="v2-home__lead">
            一个灰蓝色布袋，五件无人认领的物品，和一张只剩下“19:20、南门”的报到单。
          </p>
          <p className="v2-home__body">
            你将在一段完整的医院夜班故事里做出 {TOTAL_ITEMS} 次自然选择。没有正确答案，也不用猜题目在测什么——只选择你最自然会先做的事。
          </p>
        </div>

        <div className="v2-home__facts" aria-label="测评信息">
          <div><strong>5</strong><span>章群像故事</span></div>
          <div><strong>15–18</strong><span>分钟</span></div>
          <div><strong>4</strong><span>连续偏好维度</span></div>
        </div>

        <div className="v2-home__actions">
          {draft ? (
            <>
              <button type="button" className="v2-button v2-button--primary" onClick={() => navigate('/test')}>
                继续夜班 <span>{progress}%</span>
              </button>
              <button type="button" className="v2-button v2-button--ghost" onClick={restart}>重新开始</button>
            </>
          ) : (
            <button type="button" className="v2-button v2-button--primary" onClick={begin}>
              推开患者服务中心的门
            </button>
          )}
        </div>

        <p className="v2-home__notice">
          非官方 MBTI，也不是临床诊断或能力测验。结果用于自我观察，并会诚实展示不确定性。
        </p>

        {history.length > 0 && (
          <section className="v2-home__history" aria-labelledby="recent-results">
            <div className="v2-home__history-title">
              <h2 id="recent-results">最近的夜班记录</h2>
              <span>结果仅保存在这台设备</span>
            </div>
            <div className="v2-home__history-list">
              {history.slice(0, 3).map((entry) => (
                <button type="button" key={entry.id} onClick={() => navigate(`/result/${entry.id}`)}>
                  <span className="v2-home__history-type">{entry.result.bestFitType}</span>
                  <span>
                    {TYPE_NAMES[entry.result.bestFitType] ?? '类型候选'}
                    <small>{new Date(entry.createdAt).toLocaleDateString('zh-CN')}</small>
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

