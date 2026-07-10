import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/testStore';
import RadarChart from '../components/RadarChart';
import FunctionStack from '../components/FunctionStack';
import TypeMatch from '../components/TypeMatch';
import QualityReport from '../components/QualityReport';
import type { AssessmentResult } from '../types';
import { TYPE_DESCRIPTIONS } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storeResult = useTestStore((s) => s.result);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (storeResult && storeResult.result_id === id) {
      setResult(storeResult);
      setLoading(false);
      return;
    }

    async function fetchResult() {
      try {
        const res = await fetch(`${API_BASE}/api/result/${id}`);
        if (!res.ok) throw new Error('Result not found');
        const data = await res.json();
        setResult({
          result_id: data.result_id,
          function_scores: data.function_scores,
          function_stack: data.function_stack,
          best_match: {
            type_code: data.best_match,
            distance: 0,
            match_percentage: 0,
          },
          second_match: {
            type_code: data.second_match,
            distance: 0,
            match_percentage: 0,
          },
          all_matches: [],
          quality: {
            consistency_score: data.consistency_score,
            consistency_warning: data.consistency_score < 0.6,
            attention_passed: data.attention_passed,
            attention_failures: 0,
            social_desirability_score: 0,
            social_desirability_warning: false,
          },
          warnings: [],
        });
      } catch (err) {
        setError('结果未找到');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchResult();
  }, [id, storeResult]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt dark:bg-slate-900">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-alt dark:bg-slate-900">
        <p className="text-xl text-text-muted dark:text-slate-400">{error || '结果未找到'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-white rounded-xl cursor-pointer hover:bg-primary-dark"
        >
          返回首页
        </button>
      </div>
    );
  }

  const bestType = result.best_match.type_code;

  return (
    <div className="min-h-screen py-8 px-4 bg-surface-alt dark:bg-slate-900">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <p className="text-sm text-text-muted dark:text-slate-400 mb-2">你的认知功能测评结果</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text dark:text-slate-100 mb-2">
            最佳匹配：{bestType}
          </h1>
          <p className="text-base sm:text-lg text-text-muted dark:text-slate-400 max-w-lg mx-auto">
            {TYPE_DESCRIPTIONS[bestType] || ''}
          </p>
        </div>

        <TypeMatch
          bestMatch={result.best_match}
          secondMatch={result.second_match}
          allMatches={result.all_matches}
        />
        <RadarChart scores={result.function_scores} />
        <FunctionStack stack={result.function_stack} scores={result.function_scores} />
        <QualityReport quality={result.quality} warnings={result.warnings} />

        <div className="flex justify-center gap-4 pt-4 pb-8">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-primary text-white rounded-xl font-semibold
                       hover:bg-primary-dark active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/25"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
