interface TabNavigationProps {
  tabs: { key: string; label: string; icon: string }[];
  active: string;
  onChange: (key: string) => void;
}

export default function TabNavigation({ tabs, active, onChange }: TabNavigationProps) {
  return (
    <div className="sticky top-0 z-30 bg-surface/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-700 -mx-4 sm:mx-0">
      <div className="flex overflow-x-auto scrollbar-hide px-1 sm:px-0" role="tablist">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={`relative shrink-0 px-2.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer
                ${isActive
                  ? 'text-primary dark:text-indigo-400'
                  : 'text-text-muted dark:text-slate-400 hover:text-text dark:hover:text-slate-200'
                }`}
            >
              <span className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-sm sm:text-base">{tab.icon}</span>
                <span className="whitespace-nowrap">{tab.label}</span>
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary dark:bg-indigo-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
