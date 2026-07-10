import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/testStore';
import RadarChart from '../components/RadarChart';
import FunctionStack from '../components/FunctionStack';
import TypeMatch from '../components/TypeMatch';
import QualityReport from '../components/QualityReport';
import TabNavigation from '../components/TabNavigation';
import FunctionInsight from '../components/FunctionInsight';
import TypeDynamics from '../components/TypeDynamics';
import GrowthGuide from '../components/GrowthGuide';
import ShareButton from '../components/ShareButton';
import { generatePersonalizedResult } from '../utils/interpretation';
import type { AssessmentResult, PersonalizedResult } from '../types';
import { TYPE_DESCRIPTIONS, FUNC_LABELS } from '../types';

const TABS = [
  { key: 'overview', label: '概览', icon: '📊' },
  { key: 'functions', label: '功能详解', icon: '🔍' },
  { key: 'dynamics', label: '认知动力', icon: '🔄' },
  { key: 'growth', label: '成长指南', icon: '🌱' },
  { key: 'quality', label: '作答质量', icon: '✅' },
];

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storeResult = useTestStore((s) => s.result);
  const history = useTestStore((s) => s.history);

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Try store first, then localStorage
    if (storeResult && storeResult.result_id === id) {
      setResult(storeResult);
      setLoading(false);
      return;
    }

    // Try history
    const saved = history.find((e) => e.id === id);
    if (saved) {
      setResult(saved.result);
      setLoading(false);
      return;
    }

    // Try loading history from storage
    try {
      const raw = localStorage.getItem('mbti_cognitive_history');
      if (raw) {
        const entries = JSON.parse(raw);
        const match = entries.find((e: any) => e.id === id);
        if (match) {
          setResult(match.result);
          setLoading(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    setLoading(false);
  }, [id, storeResult, history]);

  const personalized: PersonalizedResult | null = useMemo(
    () => (result ? generatePersonalizedResult(result) : null),
    [result],
  );

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt dark:bg-slate-900">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!result || !personalized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-alt dark:bg-slate-900 px-5">
        <p className="text-lg text-text-muted dark:text-slate-400 text-center">
          结果未找到，请重新测评
        </p>
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
  const summary = `${bestType}「${TYPE_DESCRIPTIONS[bestType]?.split(' — ')[0] || ''}」，主导功能 ${FUNC_LABELS[personalized.dominantFunction]}，辅助功能 ${FUNC_LABELS[personalized.auxiliaryFunction]}`;

  return (
    <div className="min-h-screen bg-surface-alt dark:bg-slate-900">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center pt-6 sm:pt-8 pb-3 px-4">
          <p className="text-xs sm:text-sm text-text-muted dark:text-slate-400 mb-1.5">
            你的认知功能测评结果
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-text dark:text-slate-100 mb-2">
            最佳匹配：{bestType}
          </h1>
          <p className="text-sm sm:text-lg text-text-muted dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            {TYPE_DESCRIPTIONS[bestType] || ''}
          </p>

          {/* Summary snippet */}
          <p className="mt-3 text-xs sm:text-sm text-text-muted dark:text-slate-500 max-w-md mx-auto leading-relaxed">
            {personalized.summary}
          </p>

          {/* Share + History buttons */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4">
            <ShareButton resultSummary={summary} />
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl
                         bg-gray-100 dark:bg-slate-700 text-text dark:text-slate-200
                         hover:bg-gray-200 dark:hover:bg-slate-600
                         text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              查看历史
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        <div className="px-4 pt-4 pb-12">
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <TypeMatch
                bestMatch={result.best_match}
                secondMatch={result.second_match}
                allMatches={result.all_matches}
              />
              <RadarChart scores={result.function_scores} />
              <FunctionStack stack={result.function_stack} scores={result.function_scores} />
            </div>
          )}

          {activeTab === 'functions' && (
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-text-muted dark:text-slate-500 text-center mb-2">
                点击卡片展开查看完整解读。按得分从高到低排列。
              </p>
              {personalized.functionDetails.map((func) => (
                <FunctionInsight
                  key={func.code}
                  func={func}
                  defaultExpanded={func.rank <= 2}
                />
              ))}
            </div>
          )}

          {activeTab === 'dynamics' && (
            <TypeDynamics
              dynamics={personalized.typeDynamics}
              dominant={personalized.dominantFunction}
              auxiliary={personalized.auxiliaryFunction}
              tertiary={personalized.tertiaryFunction}
              inferior={personalized.inferiorFunction}
            />
          )}

          {activeTab === 'growth' && (
            <GrowthGuide
              jobMatches={personalized.jobMatches}
              growthForWeakest={personalized.growthForWeakest}
              growthForStrongest={personalized.growthForStrongest}
              communicationStyle={personalized.communicationStyle}
              decisionStyle={personalized.decisionStyle}
              learningStyle={personalized.learningStyle}
            />
          )}

          {activeTab === 'quality' && (
            <QualityReport quality={result.quality} warnings={result.warnings} />
          )}
        </div>

        {/* Bottom actions */}
        <div className="flex justify-center gap-3 px-4 pb-10">
          <button
            onClick={() => navigate('/')}
            className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-white rounded-xl font-semibold
                       hover:bg-primary-dark active:scale-[0.98] transition-all cursor-pointer
                       shadow-lg shadow-primary/25 min-h-[48px] text-sm sm:text-base"
          >
            重新测评
          </button>
        </div>
      </div>
    </div>
  );
}
