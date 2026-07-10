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
    <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-base sm:text-lg font-semibold text-text dark:text-slate-100 mb-4 text-center">
        类型匹配排名
      </h3>
      <div className="space-y-2.5 sm:space-y-3">
        {topMatches.map((match, idx) => {
          const pct = match.match_percentage || 0;
          const isBest = idx === 0;
          return (
            <div key={match.type_code} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-medium text-text-muted dark:text-slate-500 w-5 sm:w-6">
                  #{idx + 1}
                </span>
                <span
                  className={`font-bold ${isBest ? 'text-base sm:text-lg text-primary' : 'text-sm sm:text-base text-text dark:text-slate-200'}`}
                >
                  {match.type_code}
                </span>
                <span className="text-[11px] sm:text-sm text-text-muted dark:text-slate-400 truncate hidden xs:inline">
                  {TYPE_DESCRIPTIONS[match.type_code]?.split(' — ')[0] || ''}
                </span>
                <span className="ml-auto text-sm sm:text-base font-semibold text-text dark:text-slate-200">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isBest ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] sm:text-xs text-text-muted dark:text-slate-500 mt-3 text-center">
        匹配度基于 8 项认知功能得分与各类型理想功能栈的欧氏距离计算
      </p>
    </div>
  );
}
