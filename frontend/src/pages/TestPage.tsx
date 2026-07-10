import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/testStore';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { computeScores, buildFunctionStack, computeTypeMatches, checkQuality, generateWarnings } from '../utils/scoring';
import questionsData from '../data/questions.json';
import type { Question } from '../types';

export default function TestPage() {
  const navigate = useNavigate();
  const {
    phase,
    questions,
    currentIndex,
    answers,
    setPhase,
    setQuestions,
    startTest,
    submitAnswer,
    setResult,
  } = useTestStore();

  useEffect(() => {
    if (phase === 'idle') {
      const qs = (questionsData as any).questions as Question[];
      setQuestions(qs);
      startTest();
    }
  }, [phase, setQuestions, startTest]);

  // Prevent accidental pull-to-refresh and back navigation during test
  useEffect(() => {
    if (phase !== 'testing') return;
    const el = document.body;
    const prevStyle = el.style.overscrollBehavior;
    el.style.overscrollBehavior = 'none';
    return () => { el.style.overscrollBehavior = prevStyle; };
  }, [phase]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? answers.find((a) => a.question_id === currentQuestion.id)
    : undefined;
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;

  const handleSelect = (value: number) => {
    submitAnswer(value);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      useTestStore.setState({ currentIndex: currentIndex + 1 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      useTestStore.setState({ currentIndex: currentIndex - 1 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setPhase('processing');

    setTimeout(() => {
      const allAnswers = useTestStore.getState().answers;
      const fullQuestions = (questionsData as any).questions;

      const scores = computeScores(allAnswers, fullQuestions);
      const stack = buildFunctionStack(scores);
      const allMatches = computeTypeMatches(scores);
      const quality = checkQuality(allAnswers, fullQuestions);
      const warnings = generateWarnings(quality);

      const bestMatch = allMatches[0];
      const secondMatch = allMatches[1] || allMatches[0];
      const resultId = Math.random().toString(36).slice(2, 10);

      setResult({
        result_id: resultId,
        function_scores: scores,
        function_stack: stack,
        best_match: bestMatch,
        second_match: secondMatch,
        all_matches: allMatches,
        quality,
        warnings,
      });

      navigate(`/result/${resultId}`);
    }, 800);
  };

  if (phase === 'idle' || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt dark:bg-slate-900 px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted dark:text-slate-400">加载题库中...</p>
        </div>
      </div>
    );
  }

  if (phase === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt dark:bg-slate-900 px-4">
        <div className="text-center">
          <div className="w-14 h-14 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-lg sm:text-xl font-medium text-text dark:text-slate-100 mb-2">
            正在分析你的认知功能模式...
          </p>
          <p className="text-sm text-text-muted dark:text-slate-400">请稍等片刻</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt dark:bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-4 py-4 sm:py-8">
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        {currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            selectedValue={currentAnswer?.value}
            onSelect={handleSelect}
            onNext={handleNext}
            onPrev={handlePrev}
            isLast={isLast}
            isFirst={isFirst}
            onSubmit={handleSubmit}
          />
        )}

        {/* Question navigator */}
        <div className="mt-6 mb-4">
          <p className="text-xs text-text-muted dark:text-slate-500 text-center mb-2">
            点击跳转到任意题目
          </p>
          <div className="flex flex-wrap justify-center gap-1">
            {questions.map((q, idx) => {
              const answered = answers.some((a) => a.question_id === q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    useTestStore.setState({ currentIndex: idx });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer flex items-center justify-center
                    ${idx === currentIndex
                      ? 'bg-primary scale-125 ring-2 ring-primary/30'
                      : answered
                        ? 'bg-green-400/80 hover:bg-green-400'
                        : 'bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500'
                    }`}
                  title={`第 ${idx + 1} 题${answered ? ' (已答)' : ''}`}
                  aria-label={`跳转到第 ${idx + 1} 题`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
