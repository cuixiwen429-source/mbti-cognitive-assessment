import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/testStore';
import RadarChart from '../components/RadarChart';
import FunctionStack from '../components/FunctionStack';
import TypeMatch from '../components/TypeMatch';
import QualityReport from '../components/QualityReport';
import type { AssessmentResult } from '../types';
import { TYPE_DESCRIPTIONS } from '../types';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storeResult = useTestStore((s) => s.result);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use store result directly (client-side scoring, no API)
    if (storeResult && storeResult.result_id === id) {
      setResult(storeResult);
      setLoading(false);
    } else {
      // No result in store — redirect to home
      setLoading(false);
    }
  }, [id, storeResult]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt dark:bg-slate-900">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-alt dark:bg-slate-900">
        <p className="text-xl text-text-muted dark:text-slate-400">结果未找到，请重新测评</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-white rounded-xl cursor-pointer hover:bg-primary-dark"
        >
          开始测评
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
