import type { TypeDynamicsData } from '../types';
import { FUNC_LABELS } from '../types';

interface TypeDynamicsProps {
  dynamics: TypeDynamicsData;
  dominant: string;
  auxiliary: string;
  tertiary: string;
  inferior: string;
}

export default function TypeDynamics({
  dynamics,
  dominant,
  auxiliary,
  tertiary,
  inferior,
}: TypeDynamicsProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Function relationship diagram */}
      <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-text dark:text-slate-200 mb-4 text-center">
          你的认知功能动力结构
        </h3>

        <div className="flex flex-col items-center gap-3">
          {/* Dominant + Auxiliary */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <div className="flex-1 bg-primary/10 dark:bg-indigo-500/10 border-2 border-primary dark:border-indigo-500 rounded-xl p-3 text-center">
              <div className="text-[10px] text-text-muted dark:text-slate-500 mb-0.5">主导功能</div>
              <div className="font-bold text-sm text-primary dark:text-indigo-400">{dominant} {FUNC_LABELS[dominant]}</div>
            </div>
            <svg className="w-6 h-6 text-gray-300 dark:text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="flex-1 bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-400 dark:border-emerald-500 rounded-xl p-3 text-center">
              <div className="text-[10px] text-text-muted dark:text-slate-500 mb-0.5">辅助功能</div>
              <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{auxiliary} {FUNC_LABELS[auxiliary]}</div>
            </div>
          </div>

          {/* Arrow down to tertiary */}
          <svg className="w-5 h-5 text-gray-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>

          <div className="bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-300 dark:border-amber-500 rounded-xl p-3 text-center w-full max-w-xs">
            <div className="text-[10px] text-text-muted dark:text-slate-500 mb-0.5">第三功能</div>
            <div className="font-bold text-sm text-amber-600 dark:text-amber-400">{tertiary} {FUNC_LABELS[tertiary]}</div>
          </div>

          {/* Arrow down to inferior */}
          <svg className="w-5 h-5 text-gray-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>

          <div className="bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-300 dark:border-rose-500 rounded-xl p-3 text-center w-full max-w-xs">
            <div className="text-[10px] text-text-muted dark:text-slate-500 mb-0.5">劣势功能（成长方向）</div>
            <div className="font-bold text-sm text-rose-500 dark:text-rose-400">{inferior} {FUNC_LABELS[inferior]}</div>
          </div>
        </div>
      </div>

      {/* Dominant-Auxiliary Loop */}
      <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-primary dark:text-indigo-400 mb-2 flex items-center gap-1.5">
          <span>🔄</span> 主导-辅助循环
        </h4>
        <p className="text-sm text-text dark:text-slate-300 leading-relaxed">{dynamics.dominantAuxLoop}</p>
      </div>

      {/* Tertiary Temptation */}
      <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-amber-200 dark:border-amber-800">
        <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
          <span>⚠️</span> 第三功能诱惑
        </h4>
        <p className="text-sm text-text dark:text-slate-300 leading-relaxed">{dynamics.tertiaryTemptation}</p>
      </div>

      {/* Inferior Grip */}
      <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-red-200 dark:border-red-800">
        <h4 className="text-sm font-semibold text-red-500 dark:text-red-400 mb-2 flex items-center gap-1.5">
          <span>🔴</span> 压力下的劣势功能反应
        </h4>
        <p className="text-sm text-text dark:text-slate-300 leading-relaxed">{dynamics.inferiorGrip}</p>
      </div>

      {/* Growth Path */}
      <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-4 sm:p-5 border border-emerald-200 dark:border-emerald-800">
        <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
          <span>🌱</span> 成长整合路径
        </h4>
        <p className="text-sm text-text dark:text-slate-300 leading-relaxed">{dynamics.growthPath}</p>
      </div>
    </div>
  );
}
