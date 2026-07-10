import type { TypeMatch as TypeMatchType } from '../types';
import { TYPE_DESCRIPTIONS } from '../types';

interface TypeMatchProps {
  bestMatch: TypeMatchType;
  secondMatch: TypeMatchType;
  allMatches: TypeMatchType[];
}

export default function TypeMatch({
  bestMatch,
  secondMatch,
  allMatches,
}: TypeMatchProps) {
  const topMatches = allMatches.length > 0
    ? allMatches.slice(0, 5)
    : [
        { ...bestMatch, match_percentage: bestMatch.match_percentage || 85 },
        { ...secondMatch, match_percentage: secondMatch.match_percentage || 75 },
      ];

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-text dark:text-slate-100 mb-4 text-center">
        类型匹配排名
      </h3>
      <div className="space-y-3">
        {topMatches.map((match, idx) => {
          const pct = match.match_percentage || 0;
          const isBest = idx === 0;
          return (
            <div key={match.type_code} className="space-y-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs font-medium text-text-muted dark:text-slate-500 w-6">
                  #{idx + 1}
                </span>
                <span
                  className={`font-semibold ${isBest ? 'text-lg text-primary' : 'text-text dark:text-slate-200'}`}
                >
                  {match.type_code}
                </span>
                <span className="text-sm text-text-muted dark:text-slate-400 hidden sm:inline">
                  {TYPE_DESCRIPTIONS[match.type_code]?.split(' — ')[0] || ''}
                </span>
                <span className="ml-auto font-medium text-text dark:text-slate-200">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden ml-9">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isBest ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-text-muted dark:text-slate-500 mt-4 text-center">
        匹配度基于你的 8 项认知功能得分与各类型理想功能栈的欧氏距离计算
      </p>
    </div>
  );
}
