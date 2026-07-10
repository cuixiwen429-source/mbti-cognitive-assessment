import { useState } from 'react';
import type { EnhancedFunctionInfo } from '../types';
import { SCORE_TIER_COLORS } from '../types';

interface FunctionInsightProps {
  func: EnhancedFunctionInfo;
  defaultExpanded?: boolean;
}

export default function FunctionInsight({ func, defaultExpanded = false }: FunctionInsightProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { interpretation: interp } = func;

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 sm:p-5 flex items-center gap-3 sm:gap-4 text-left hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
      >
        {/* Rank badge */}
        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-text-muted dark:text-slate-300 shrink-0">
          {func.rank}
        </span>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold text-sm sm:text-base text-text dark:text-slate-100">
              {func.code}
            </span>
            <span className="text-xs sm:text-sm text-text-muted dark:text-slate-400">
              {func.label}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-text-muted dark:text-slate-500 line-clamp-1">
            {func.description}
          </p>
        </div>

        {/* Score + tier */}
        <div className="text-right shrink-0">
          <div className="text-lg sm:text-xl font-bold text-text dark:text-slate-100">
            {func.score}%
          </div>
          <span className={`inline-block text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-medium ${SCORE_TIER_COLORS[func.tier]}`}>
            {func.tierLabel}
          </span>
        </div>

        {/* Expand chevron */}
        <svg
          className={`w-4 h-4 text-text-muted dark:text-slate-400 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Score bar */}
      <div className="px-4 sm:px-5 pb-1">
        <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary dark:bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${func.score}%` }}
          />
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Overview */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wide mb-1">
              概览
            </h4>
            <p className="text-sm text-text dark:text-slate-200 leading-relaxed">{interp.overview}</p>
          </div>

          {/* Daily Life */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">日常生活</h4>
              <p className="text-xs sm:text-sm text-text dark:text-slate-300 leading-relaxed">{interp.dailyLife}</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
              <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">职场表现</h4>
              <p className="text-xs sm:text-sm text-text dark:text-slate-300 leading-relaxed">{interp.work}</p>
            </div>
          </div>

          {/* Relationships */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
            <h4 className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-1">人际关系</h4>
            <p className="text-xs sm:text-sm text-text dark:text-slate-300 leading-relaxed">{interp.relationships}</p>
          </div>

          {/* Growth */}
          <div className="bg-primary/5 dark:bg-indigo-500/10 rounded-xl p-3 border border-primary/10 dark:border-indigo-500/20">
            <h4 className="text-xs font-semibold text-primary dark:text-indigo-400 mb-1">发展建议</h4>
            <p className="text-xs sm:text-sm text-text dark:text-slate-300 leading-relaxed">{interp.growth}</p>
          </div>
        </div>
      )}
    </div>
  );
}
