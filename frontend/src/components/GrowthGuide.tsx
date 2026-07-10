import type { JobMatchResult, GrowthRecommendation } from '../types';
import { FUNC_LABELS } from '../types';

interface GrowthGuideProps {
  jobMatches: JobMatchResult[];
  growthForWeakest: { func: string; recommendation: GrowthRecommendation };
  growthForStrongest: { func: string; recommendation: GrowthRecommendation };
  communicationStyle: string;
  decisionStyle: string;
  learningStyle: string;
}

function ConfidenceStars({ level }: { level: number }) {
  return (
    <span className="text-[10px] text-amber-500 shrink-0" title={`置信度: ${'★'.repeat(level)}`}>
      {'★'.repeat(level)}
      <span className="text-gray-300 dark:text-slate-600">{'★'.repeat(3 - level)}</span>
    </span>
  );
}

export default function GrowthGuide({
  jobMatches,
  growthForWeakest,
  growthForStrongest,
  communicationStyle,
  decisionStyle,
  learningStyle,
}: GrowthGuideProps) {
  const topJobs = jobMatches.slice(0, 10);
  const categories = [...new Set(topJobs.map((j) => j.category.split('·')[0]))];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Career Matches */}
      <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-text dark:text-slate-200 mb-4 text-center">
          职业匹配推荐
        </h3>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1.5 mb-3 justify-center">
          {categories.slice(0, 5).map((cat) => (
            <span key={cat} className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-text-muted dark:text-slate-400">
              {cat}
            </span>
          ))}
        </div>

        {/* Job list */}
        <div className="space-y-2">
          {topJobs.map((job, idx) => (
            <div
              key={job.title}
              className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="text-[10px] sm:text-xs font-bold text-text-muted dark:text-slate-500 w-4 sm:w-5 shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-medium text-text dark:text-slate-200 truncate">
                    {job.title}
                  </span>
                  <ConfidenceStars level={job.confidence} />
                </div>
                <p className="text-[10px] sm:text-xs text-text-muted dark:text-slate-500 line-clamp-1 mt-0.5">
                  {job.matchReason}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-xs sm:text-sm font-bold ${job.matchScore >= 85 ? 'text-primary dark:text-indigo-400' : job.matchScore >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-muted dark:text-slate-400'}`}>
                  {job.matchScore}%
                </div>
                <div className="text-[10px] text-text-muted dark:text-slate-500">匹配</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] sm:text-xs text-text-muted dark:text-slate-500 mt-3 text-center">
          ★★★ 有实证数据支持 &nbsp; ★★☆ 理论+行业观察 &nbsp; ★☆☆ 理论推导
        </p>

        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            ⚠️ 职业推荐反映的是认知模式倾向，不代表实际能力或能否胜任。岗位选择还需结合你的专业技能、教育背景、工作经验和个人兴趣综合判断。
          </p>
        </div>
      </div>

      {/* Growth advice */}
      <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-text dark:text-slate-200 mb-4 text-center">
          功能发展建议
        </h3>

        {/* For weakest */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-rose-500 dark:text-rose-400 mb-2 flex items-center gap-1.5">
            <span>🔻</span> 发展你的劣势功能：{growthForWeakest.func} {FUNC_LABELS[growthForWeakest.func]}
          </h4>
          <p className="text-xs sm:text-sm text-text dark:text-slate-300 leading-relaxed mb-2">
            {growthForWeakest.recommendation.forLowScore}
          </p>
          <div className="space-y-1">
            {growthForWeakest.recommendation.exercises.map((ex, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-text-muted dark:text-slate-400">
                <span className="text-rose-400 shrink-0 mt-0.5">•</span>
                <span>{ex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* For strongest */}
        <div>
          <h4 className="text-xs font-semibold text-primary dark:text-indigo-400 mb-2 flex items-center gap-1.5">
            <span>🔺</span> 平衡你的优势功能：{growthForStrongest.func} {FUNC_LABELS[growthForStrongest.func]}
          </h4>
          <p className="text-xs sm:text-sm text-text dark:text-slate-300 leading-relaxed mb-2">
            {growthForStrongest.recommendation.forHighScore}
          </p>
        </div>
      </div>

      {/* Styles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
          <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">🗣️ 沟通风格</h4>
          <p className="text-xs text-text dark:text-slate-300 leading-relaxed">{communicationStyle}</p>
        </div>
        <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
          <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">🎯 决策风格</h4>
          <p className="text-xs text-text dark:text-slate-300 leading-relaxed">{decisionStyle}</p>
        </div>
        <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
          <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">📚 学习风格</h4>
          <p className="text-xs text-text dark:text-slate-300 leading-relaxed">{learningStyle}</p>
        </div>
      </div>
    </div>
  );
}
