import { useState, useEffect, useCallback } from 'react';
import type { StoryChapter, StoryDecision, StoryAnswer } from '../types';

interface StorySceneProps {
  chapter: StoryChapter;
  decisionIndex: number;
  totalDecisions: number;
  globalDecisionIndex: number;
  totalGlobalDecisions: number;
  answers: StoryAnswer[];
  onAnswer: (decisionId: string, optionIndex: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstDecision: boolean;
  isLastDecision: boolean;
}

export default function StoryScene({
  chapter,
  decisionIndex,
  totalDecisions,
  globalDecisionIndex,
  totalGlobalDecisions,
  answers,
  onAnswer,
  onNext,
  onPrev,
  isFirstDecision,
  isLastDecision,
}: StorySceneProps) {
  const [showScene, setShowScene] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const decision: StoryDecision = chapter.decisions[decisionIndex];
  const currentAnswer = answers.find((a) => a.decisionId === decision.id);
  const isAnswered = currentAnswer !== undefined;

  // Animation sequence on mount / decision change
  useEffect(() => {
    setShowScene(false);
    setShowOptions(false);
    setSelectedOption(isAnswered ? currentAnswer.selectedOption : null);

    const t1 = setTimeout(() => setShowScene(true), 100);
    const t2 = setTimeout(() => setShowOptions(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [decision.id]);

  const handleSelect = useCallback((optIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optIdx);
    onAnswer(decision.id, optIdx);
    // Brief delay before advancing
    setTimeout(() => {
      if (!isLastDecision) {
        onNext();
      }
    }, 500);
  }, [decision.id, isAnswered, isLastDecision, onAnswer, onNext]);

  const globalProgress = ((globalDecisionIndex + 1) / totalGlobalDecisions) * 100;

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden bg-slate-950 ${chapter.gradient.includes('from') ? `bg-gradient-to-b ${chapter.gradient}` : ''}`}
         style={{ background: !chapter.gradient.includes('from') ? chapter.gradient : undefined }}>
      {/* Ambient particles / stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Chapter header */}
      <div className="relative z-10 px-5 pt-8 sm:pt-12 pb-2">
        {/* Global progress */}
        <div className="max-w-lg mx-auto mb-4">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/50 mb-1.5">
            <span>第 {chapter.id} 章 · {chapter.title}</span>
            <span>{Math.round(globalProgress)}%</span>
          </div>
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/40 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${globalProgress}%` }}
            />
          </div>
        </div>

        {/* Chapter title */}
        <div className="text-center max-w-lg mx-auto">
          <span className="text-3xl sm:text-4xl mb-2 block">{chapter.icon}</span>
          <h2 className="text-lg sm:text-xl font-bold text-white/90 mb-0.5">
            {chapter.title}
          </h2>
          <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
            {chapter.subtitle}
          </p>
        </div>
      </div>

      {/* Scene text */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className={`max-w-lg mx-auto px-5 transition-all duration-700 ${showScene ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Scene description */}
          <div className="mb-8">
            {/* Show scene only on first decision of chapter */}
            {decisionIndex === 0 && (
              <p className="text-sm sm:text-base text-white/70 leading-relaxed italic border-l-2 border-white/20 pl-4 mb-6">
                {chapter.scene}
              </p>
            )}
            {/* Decision context */}
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-3">
              {decision.context}
            </p>
            <p className="text-base sm:text-lg text-white/90 font-medium leading-relaxed">
              {decision.question}
            </p>
          </div>

          {/* Options */}
          <div className={`space-y-2.5 sm:space-y-3 transition-all duration-500 ${showOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {decision.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const optionLetter = ['A', 'B', 'C', 'D'][idx];

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered && !isSelected}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer
                    ${isSelected
                      ? 'bg-white/15 border-white/30 scale-[1.02] shadow-lg shadow-white/5'
                      : isAnswered
                        ? 'bg-white/3 border-white/10 opacity-40'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25 hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors
                      ${isSelected
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'border-white/20 text-white/50'
                      }`}>
                      {optionLetter}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm sm:text-base leading-snug ${isSelected ? 'text-white' : 'text-white/80'}`}>
                        {opt.text}
                      </p>
                      {opt.subtext && (
                        <p className={`text-[11px] sm:text-xs mt-1 ${isSelected ? 'text-white/50' : 'text-white/35'}`}>
                          {opt.subtext}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <svg className="w-5 h-5 text-white/60 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="relative z-10 px-5 pb-6 sm:pb-8">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={isFirstDecision}
            className={`text-xs sm:text-sm px-3 py-2 rounded-xl transition-colors cursor-pointer
              ${isFirstDecision
                ? 'text-white/20 cursor-default'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
          >
            ← 上一题
          </button>

          <span className="text-[10px] sm:text-xs text-white/30">
            {decisionIndex + 1} / {totalDecisions}
          </span>

          {isLastDecision && isAnswered && (
            <button
              onClick={onNext}
              className="text-xs sm:text-sm px-4 py-2 rounded-xl bg-white/10 text-white/80
                         hover:bg-white/20 transition-colors cursor-pointer font-medium"
            >
              完成本章 →
            </button>
          )}

          {!isLastDecision && isAnswered && (
            <span className="text-[10px] sm:text-xs text-white/30">自动跳转中...</span>
          )}
        </div>
      </div>
    </div>
  );
}
