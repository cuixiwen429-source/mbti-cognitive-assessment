import { useState, useEffect } from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedValue: number | undefined;
  onSelect: (value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isLast: boolean;
  isFirst: boolean;
  onSubmit: () => void;
}

export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
  onNext,
  onPrev,
  isLast,
  isFirst,
  onSubmit,
}: QuestionCardProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  useEffect(() => {
    setHoveredValue(null);
  }, [question.id]);

  const renderLikert = () => (
    <div className="space-y-4">
      {/* Mobile: vertical stack with labels */}
      <div className="sm:hidden space-y-2.5">
        {[
          { val: 1, label: '完全不符合' },
          { val: 2, label: '不符合' },
          { val: 3, label: '有点不符合' },
          { val: 4, label: '中立' },
          { val: 5, label: '有点符合' },
          { val: 6, label: '符合' },
          { val: 7, label: '完全符合' },
        ].map(({ val, label }) => (
          <button
            key={val}
            onClick={() => onSelect(val)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer min-h-[48px]
              ${selectedValue === val
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 dark:bg-slate-700/70 text-text-muted dark:text-slate-300 active:bg-gray-200 dark:active:bg-slate-600'
              }`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${selectedValue === val ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-600 text-text-muted dark:text-slate-300'}`}
            >
              {val}
            </span>
            {label}
          </button>
        ))}
      </div>

      {/* Desktop: horizontal number grid */}
      <div className="hidden sm:flex justify-between gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7].map((val) => (
          <button
            key={val}
            onClick={() => onSelect(val)}
            onMouseEnter={() => setHoveredValue(val)}
            onMouseLeave={() => setHoveredValue(null)}
            className={`w-12 h-12 rounded-xl text-sm font-medium transition-all cursor-pointer
              ${selectedValue === val
                ? 'bg-primary text-white scale-110 shadow-md'
                : (hoveredValue !== null && val <= hoveredValue)
                  ? 'bg-primary/20 text-primary'
                  : 'bg-gray-100 dark:bg-slate-700 text-text-muted dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="hidden sm:flex justify-between text-xs text-text-muted dark:text-slate-500 px-1">
        <span>完全不符合</span>
        <span>完全符合</span>
      </div>
    </div>
  );

  const renderSJT = () => (
    <div className="space-y-2.5">
      {(question.options || []).map((opt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl border-2 transition-all cursor-pointer min-h-[48px]
            ${selectedValue === idx
              ? 'border-primary bg-primary/5 dark:bg-primary/10 text-text dark:text-slate-200 shadow-sm'
              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-text-muted dark:text-slate-400 active:border-gray-300 dark:active:border-slate-600 active:bg-gray-50 dark:active:bg-slate-700/50'
            }`}
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full
                           bg-gray-100 dark:bg-slate-700 text-sm font-medium text-text-muted dark:text-slate-300 mr-2.5 shrink-0">
            {String.fromCharCode(65 + idx)}
          </span>
          <span className="text-sm sm:text-base">{opt.text}</span>
        </button>
      ))}
    </div>
  );

  const renderForcedChoice = () => (
    <div className="space-y-2.5">
      {(question.options || []).map((opt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl border-2 transition-all cursor-pointer min-h-[48px] text-sm sm:text-base
            ${selectedValue === idx
              ? 'border-primary bg-primary/5 dark:bg-primary/10 text-text dark:text-slate-200 shadow-sm'
              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-text-muted dark:text-slate-400 active:border-gray-300 dark:active:border-slate-600 active:bg-gray-50 dark:active:bg-slate-700/50'
            }`}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );

  const renderQuestionBody = () => {
    switch (question.type) {
      case 'sjt':
        return renderSJT();
      case 'forced_choice':
        return renderForcedChoice();
      default:
        return renderLikert();
    }
  };

  const canProceed = selectedValue !== undefined;

  return (
    <div className="w-full max-w-2xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      {/* Question text */}
      <div className="bg-surface dark:bg-slate-800 rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-xl font-medium text-text dark:text-slate-100 leading-relaxed">
          {question.text}
        </h2>
      </div>

      {/* Answer area */}
      <div className="bg-surface dark:bg-slate-800 rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700 mb-4 sm:mb-6">
        {renderQuestionBody()}
      </div>

      {/* Navigation buttons — sticky on mobile */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`px-5 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer min-h-[48px]
            ${isFirst
              ? 'bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 cursor-not-allowed'
              : 'bg-gray-100 dark:bg-slate-800 text-text-muted dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-95'
            }`}
        >
          上一题
        </button>

        <button
          onClick={isLast ? onSubmit : onNext}
          disabled={!canProceed}
          className={`flex-1 sm:flex-none px-6 sm:px-10 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer min-h-[48px]
            ${canProceed
              ? 'bg-primary text-white hover:bg-primary-dark active:scale-[0.98] shadow-md shadow-primary/20'
              : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
            }`}
        >
          {isLast ? '提交结果' : '下一题'}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
