import type { FunctionScores } from '../types';
import { FUNC_LABELS, FUNC_DESCRIPTIONS } from '../types';

interface FunctionStackProps {
  stack: string[];
  scores: FunctionScores;
}

const POSITION_LABELS = [
  { label: '主导功能', color: 'bg-primary', desc: '你最自然、最擅长使用的认知方式' },
  { label: '辅助功能', color: 'bg-accent-2', desc: '辅助主导功能的第二强功能' },
  { label: '第三功能', color: 'bg-accent-3', desc: '需要刻意练习才能熟练运用的功能' },
  { label: '劣势功能', color: 'bg-accent-4', desc: '你最不擅长、最容易消耗能量的方式' },
];

export default function FunctionStack({ stack, scores }: FunctionStackProps) {
  return (
    <div className="bg-surface dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-text dark:text-slate-100 mb-4 text-center">
        认知功能栈
      </h3>
      <div className="space-y-3">
        {stack.slice(0, 4).map((func, idx) => {
          const pos = POSITION_LABELS[idx];
          const score = (scores as any)[func];

          return (
            <div key={func} className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div
                className={`${pos.color} text-white text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg w-18 sm:w-20 text-center shrink-0 mt-0.5 sm:mt-0`}
              >
                {pos.label}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-text dark:text-slate-100">{func}</span>
                  <span className="text-sm text-text-muted dark:text-slate-400">
                    {FUNC_LABELS[func]}
                  </span>
                  <span className="text-sm font-medium text-primary ml-auto">{score}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${pos.color}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted dark:text-slate-500 mt-1">
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
