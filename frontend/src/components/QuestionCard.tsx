import { useState, useEffect } from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedValue: number | undefined;
  onSelect: (value: number) => void;
  onNext: () => void;
  isLast: boolean;
  onSubmit: () => void;
}

export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
  onNext,
  isLast,
  onSubmit,
}: QuestionCardProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  useEffect(() => {
    setHoveredValue(null);
  }, [question.id]);

  const renderLikert = () => (
    <div className="space-y-3">
      <div className="flex justify-between gap-1">
        {[1, 2, 3, 4, 5, 6, 7].map((val) => (
          <button
            key={val}
            onClick={() => onSelect(val)}
            onMouseEnter={() => setHoveredValue(val)}
            onMouseLeave={() => setHoveredValue(null)}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-sm font-medium transition-all cursor-pointer
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
      <div className="flex justify-between text-xs text-text-muted dark:text-slate-500 px-1">
        <span>完全不符合</span>
        <span>完全符合</span>
      </div>
    </div>
  );

  const renderSJT = () => (
    <div className="space-y-3">
      {(question.options || []).map((opt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 transition-all cursor-pointer
            ${selectedValue === idx
              ? 'border-primary bg-primary/5 dark:bg-primary/10 text-text dark:text-slate-200'
              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-text-muted dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50'
            }`}
        >
          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full
                           bg-gray-100 dark:bg-slate-700 text-sm font-medium text-text-muted dark:text-slate-300 mr-2 sm:mr-3">
            {String.fromCharCode(65 + idx)}
          </span>
          {opt.text}
        </button>
      ))}
    </div>
  );

  const renderForcedChoice = () => (
    <div className="space-y-3">
      {(question.options || []).map((opt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 transition-all cursor-pointer
            ${selectedValue === idx
              ? 'border-primary bg-primary/5 dark:bg-primary/10 text-text dark:text-slate-200'
              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-text-muted dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50'
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
      <div className="bg-surface dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-text dark:text-slate-100 leading-relaxed">
          {question.text}
        </h2>
      </div>

      <div className="bg-surface dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
        {renderQuestionBody()}
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={isLast ? onSubmit : onNext}
          disabled={!canProceed}
          className={`px-6 sm:px-8 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer
            ${canProceed
              ? 'bg-primary text-white hover:bg-primary-dark active:scale-95'
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
