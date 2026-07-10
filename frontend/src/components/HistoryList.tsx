import type { HistoryEntry } from '../types';
import { TYPE_DESCRIPTIONS, FUNC_LABELS } from '../types';

interface HistoryListProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  compareMode?: boolean;
}

export default function HistoryList({
  entries,
  onSelect,
  onDelete,
  selectedIds = [],
  onToggleSelect,
  compareMode = false,
}: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-text-muted dark:text-slate-400 text-sm">暂无历史测评记录</p>
        <p className="text-text-muted dark:text-slate-500 text-xs mt-1">完成一次测评后，结果将自动保存在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const { result } = entry;
        const best = result.best_match;
        const date = new Date(entry.createdAt);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        const selected = selectedIds.includes(entry.id);

        return (
          <div
            key={entry.id}
            className={`bg-surface dark:bg-slate-800 rounded-2xl border transition-colors cursor-pointer
              ${selected
                ? 'border-primary dark:border-indigo-500 ring-1 ring-primary/20'
                : 'border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600'
              }`}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                {/* Checkbox for compare mode */}
                {compareMode && onToggleSelect && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleSelect(entry.id); }}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer
                      ${selected
                        ? 'bg-primary border-primary dark:bg-indigo-500 dark:border-indigo-500'
                        : 'border-gray-300 dark:border-slate-600'
                      }`}
                  >
                    {selected && <span className="text-white text-xs">✓</span>}
                  </button>
                )}

                {/* Main content */}
                <div className="flex-1 min-w-0" onClick={() => onSelect(entry)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm sm:text-base text-text dark:text-slate-100">
                      {best.type_code}
                    </span>
                    <span className="text-[10px] sm:text-xs text-text-muted dark:text-slate-500 truncate">
                      {TYPE_DESCRIPTIONS[best.type_code]?.split(' — ')[0] || ''}
                    </span>
                    <span className="ml-auto text-[10px] sm:text-xs text-text-muted dark:text-slate-500 shrink-0">
                      {dateStr}
                    </span>
                  </div>

                  {/* Function stack mini */}
                  <div className="flex gap-1.5 mb-1.5 flex-wrap">
                    {result.function_stack.slice(0, 4).map((f, i) => (
                      <span key={f} className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-text-muted dark:text-slate-400">
                        {i + 1}. {f} {FUNC_LABELS[f]}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[10px] sm:text-xs text-text-muted dark:text-slate-500">
                    <span>匹配度 {best.match_percentage}%</span>
                    <span>⏱ {Math.floor(entry.durationSeconds / 60)}分{entry.durationSeconds % 60}秒</span>
                    {!result.quality.attention_passed && (
                      <span className="text-amber-500">⚠ 注意力检测未通过</span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                  className="text-gray-400 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors p-1 shrink-0 cursor-pointer"
                  aria-label="删除记录"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
