import type { QualityReport as QualityReportType } from '../types';

interface QualityReportProps {
  quality: QualityReportType;
  warnings: string[];
}

export default function QualityReport({ quality, warnings }: QualityReportProps) {
  return (
    <div className="bg-surface dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-text dark:text-slate-100 mb-4 text-center">
        作答质量报告
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
          <div
            className={`text-2xl font-bold mb-1 ${quality.attention_passed ? 'text-green-500' : 'text-red-500'}`}
          >
            {quality.attention_passed ? '通过 ✓' : '未通过 ✕'}
          </div>
          <p className="text-xs text-text-muted dark:text-slate-400">注意力检测</p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
          <div
            className={`text-2xl font-bold mb-1 ${
              quality.consistency_score >= 0.8
                ? 'text-green-500'
                : quality.consistency_score >= 0.6
                  ? 'text-yellow-500'
                  : 'text-red-500'
            }`}
          >
            {Math.round(quality.consistency_score * 100)}%
          </div>
          <p className="text-xs text-text-muted dark:text-slate-400">作答一致性</p>
        </div>
      </div>

      {quality.social_desirability_score > 0 && (
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4 text-center">
          <div
            className={`text-lg font-semibold mb-1 ${
              quality.social_desirability_score > 75
                ? 'text-red-500'
                : quality.social_desirability_score > 50
                  ? 'text-yellow-500'
                  : 'text-green-500'
            }`}
          >
            {quality.social_desirability_score}% —{' '}
            {quality.social_desirability_score > 75
              ? '偏高'
              : quality.social_desirability_score > 50
                ? '正常偏高'
                : '正常'}
          </div>
          <p className="text-xs text-text-muted dark:text-slate-400">社会期望偏向指数</p>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-text dark:text-slate-200">提示：</p>
          {warnings.map((w, i) => (
            <div
              key={i}
              className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3"
            >
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{w}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
