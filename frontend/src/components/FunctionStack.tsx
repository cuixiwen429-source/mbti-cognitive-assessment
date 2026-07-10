import type { FunctionScores } from '../types';
import { FUNC_LABELS, FUNC_DESCRIPTIONS } from '../types';

interface FunctionStackProps {
  stack: string[];
  scores: FunctionScores;
}

const POSITION_LABELS = [
  { label: '主导', color: 'bg-primary', desc: '你最自然、最擅长使用的认知方式' },
  { label: '辅助', color: 'bg-accent-2', desc: '辅助主导功能的第二强功能' },
  { label: '第三', color: 'bg-accent-3', desc: '需要刻意练习才能熟练运用的功能' },
  { label: '劣势', color: 'bg-accent-4', desc: '你最不擅长、最容易消耗能量的方式' },
];

export default function FunctionStack({ stack, scores }: FunctionStackProps) {
  return (
    <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-base sm:text-lg font-semibold text-text dark:text-slate-100 mb-4 text-center">
        认知功能栈
      </h3>
      <div className="space-y-3">
        {stack.slice(0, 4).map((func, idx) => {
          const pos = POSITION_LABELS[idx];
          const score = (scores as any)[func];

          return (
            <div key={func} className="flex items-start gap-2.5 sm:gap-4">
              <div
                className={`${pos.color} text-white text-[11px] sm:text-xs font-semibold px-2 py-1.5 rounded-lg w-14 sm:w-16 text-center shrink-0 mt-0.5`}
              >
                {pos.label}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 mb-1 flex-wrap">
                  <span className="font-semibold text-sm sm:text-base text-text dark:text-slate-100">{func}</span>
                  <span className="text-xs sm:text-sm text-text-muted dark:text-slate-400">
                    {FUNC_LABELS[func]}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-primary ml-auto">{score}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${pos.color}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-[11px] sm:text-xs text-text-muted dark:text-slate-500 mt-1 leading-relaxed">
                  {FUNC_DESCRIPTIONS[func]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
