export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full mb-6 sm:mb-8">
      <div className="flex justify-between text-xs sm:text-sm text-text-muted dark:text-slate-400 mb-1.5 sm:mb-2">
        <span>
          第 {current} / {total} 题
        </span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2.5 sm:h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
