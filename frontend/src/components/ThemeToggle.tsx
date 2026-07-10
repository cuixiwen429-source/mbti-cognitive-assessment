import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-xl
                 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm
                 border border-gray-200 dark:border-slate-700 shadow-sm
                 flex items-center justify-center text-base sm:text-lg
                 hover:scale-110 active:scale-95 transition-all cursor-pointer"
      aria-label={dark ? '切换亮色模式' : '切换暗色模式'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
