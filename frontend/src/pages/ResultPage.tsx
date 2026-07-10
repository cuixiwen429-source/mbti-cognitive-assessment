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
    if (storeResult && storeResult.result_id === id) {
      setResult(storeResult);
      setLoading(false);
    } else {
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-alt dark:bg-slate-900 px-5">
        <p className="text-lg text-text-muted dark:text-slate-400 text-center">结果未找到，请重新测评</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-primary text-white rounded-xl font-semibold cursor-pointer hover:bg-primary-dark active:scale-[0.98] transition-all min-h-[48px]"
        >
          开始测评
        </button>
      </div>
    );
  }

  const bestType = result.best_match.type_code;

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-4 bg-surface-alt dark:bg-slate-900">
      <div className="max-w-3xl mx-auto space-y-5 sm:space-y-8">
        {/* Header */}
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-text-muted dark:text-slate-400 mb-1.5 sm:mb-2">
            你的认知功能测评结果
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-text dark:text-slate-100 mb-2">
            最佳匹配：{bestType}
          </h1>
          <p className="text-sm sm:text-lg text-text-muted dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
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

        <div className="flex justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 pb-10">
          <button
            onClick={() => navigate('/')}
            className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-white rounded-xl font-semibold
                       hover:bg-primary-dark active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/25
                       min-h-[48px] text-sm sm:text-base"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
