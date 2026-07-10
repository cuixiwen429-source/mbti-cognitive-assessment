import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import V2ResultView, { type V2ResearchStatus } from '../components/v2/V2ResultView';
import { V2_ASSESSMENT } from '../data/v2Assessment';
import { useV2TestStore } from '../store/v2TestStore';
import {
  retryQueuedResearch,
  submitAnonymousResearch,
} from '../utils/researchSubmission';
import '../components/v2/v2.css';

export default function V2ResultPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const {
    hydrated,
    history,
    hydrate,
    loadResult,
    discardDraft,
    startNew,
  } = useV2TestStore();
  const [researchStatus, setResearchStatus] = useState<V2ResearchStatus>('idle');

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrate, hydrated]);

  useEffect(() => {
    const retry = () => { void retryQueuedResearch(); };
    retry();
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, []);

  const result = hydrated ? loadResult(id) : null;
  const historyEntry = useMemo(
    () => history.find((entry) => entry.id === id),
    [history, id],
  );
  const ending = result?.ending
    ? V2_ASSESSMENT.finale.choices.find((choice) => choice.id === result.ending) ?? null
    : null;

  const restart = () => {
    discardDraft();
    startNew();
    navigate('/test');
  };

  const submitResearch = async () => {
    if (!result) return;
    const responses = historyEntry?.responses ?? [];
    if (responses.length === 0) return;
    setResearchStatus('submitting');
    try {
      const outcome = await submitAnonymousResearch(result, responses);
      setResearchStatus(outcome === 'submitted' ? 'submitted' : 'queued');
    } catch {
      setResearchStatus('failed');
    }
  };

  if (!hydrated) {
    return (
      <main className="v2-loading" aria-live="polite">
        <span />
        <p>正在整理夜班报告……</p>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="v2-not-found">
        <p>这份夜班记录不在当前设备上。</p>
        <h1>结果未找到</h1>
        <span>结果默认只保存在完成测评的浏览器里。</span>
        <button type="button" className="v2-button v2-button--primary" onClick={() => navigate('/')}>
          回到首页
        </button>
      </main>
    );
  }

  return (
    <V2ResultView
      result={result}
      ending={ending}
      onRestart={restart}
      onHome={() => navigate('/')}
      onResearchConsent={submitResearch}
      researchStatus={researchStatus}
    />
  );
}
