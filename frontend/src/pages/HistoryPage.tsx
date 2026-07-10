import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/testStore';
import HistoryList from '../components/HistoryList';
import CompareChart from '../components/CompareChart';
import type { HistoryEntry } from '../types';

export default function HistoryPage() {
  const navigate = useNavigate();
  const history = useTestStore((s) => s.history);
  const loadHistoryFromStorage = useTestStore((s) => s.loadHistoryFromStorage);
  const deleteHistory = useTestStore((s) => s.deleteHistory);
  const clearHistory = useTestStore((s) => s.clearHistory);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    loadHistoryFromStorage();
  }, [loadHistoryFromStorage]);

  const handleSelect = (entry: HistoryEntry) => {
    if (compareMode) {
      setSelectedIds((prev) =>
        prev.includes(entry.id)
          ? prev.filter((id) => id !== entry.id)
          : prev.length < 4
            ? [...prev, entry.id]
            : prev,
      );
    } else {
      navigate(`/result/${entry.id}`);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定删除这条测评记录？')) {
      deleteHistory(id);
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    }
  };

  const toggleCompareMode = () => {
    if (compareMode) {
      setCompareMode(false);
      setSelectedIds([]);
    } else {
      setCompareMode(true);
    }
  };

  const compareEntries = selectedIds
    .map((id) => history.find((e) => e.id === id))
    .filter(Boolean) as HistoryEntry[];

  const compareData = compareEntries.map((e) => ({
    label: `${e.result.best_match.type_code} (${new Date(e.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })})`,
    scores: e.result.function_scores,
  }));

  return (
    <div className="min-h-screen bg-surface-alt dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-slate-100">
              历史测评记录
            </h1>
            <p className="text-xs sm:text-sm text-text-muted dark:text-slate-500 mt-1">
              {history.length > 0
                ? `共 ${history.length} 次记录`
                : '完成测评后自动保存'}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs sm:text-sm text-text-muted dark:text-slate-400 hover:text-text dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            返回首页
          </button>
        </div>

        {/* Action bar */}
        {history.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={toggleCompareMode}
              className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer
                ${compareMode
                  ? 'bg-primary text-white dark:bg-indigo-500'
                  : 'bg-gray-100 dark:bg-slate-700 text-text dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
            >
              {compareMode ? '退出对比' : '对比选中'}
            </button>

            {compareMode && (
              <span className="text-[10px] sm:text-xs text-text-muted dark:text-slate-500">
                选择 2-4 条记录进行对比
              </span>
            )}

            {!compareMode && history.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('确定删除所有历史记录？此操作不可恢复。')) {
                    clearHistory();
                  }
                }}
                className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 ml-auto cursor-pointer"
              >
                清空全部
              </button>
            )}
          </div>
        )}

        {/* Compare chart */}
        {compareMode && compareData.length >= 2 && (
          <div className="mb-6">
            <CompareChart data={compareData} />
          </div>
        )}

        {compareMode && compareData.length < 2 && (
          <div className="mb-6 p-6 text-center bg-surface dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
            <p className="text-sm text-text-muted dark:text-slate-400">
              请勾选至少 2 条记录以查看对比图
            </p>
          </div>
        )}

        {/* History list */}
        <HistoryList
          entries={history}
          onSelect={handleSelect}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onToggleSelect={(id) => {
            setSelectedIds((prev) =>
              prev.includes(id)
                ? prev.filter((sid) => sid !== id)
                : prev.length < 4
                  ? [...prev, id]
                  : prev,
            );
          }}
          compareMode={compareMode}
        />
      </div>
    </div>
  );
}
