import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/testStore';
import StoryScene from '../components/StoryScene';
import { scoreStoryAnswers, checkStoryQuality } from '../utils/storyScoring';
import { buildFunctionStack, computeTypeMatches, generateWarnings } from '../utils/scoring';
import { STORY_CHAPTERS } from '../data/scenarios';
import type { StoryAnswer } from '../types';

export default function TestPage() {
  const navigate = useNavigate();
  const { phase, setPhase, setResult, startTest } = useTestStore();

  // Flatten all decisions into a single array with chapter context
  const allDecisions = useMemo(() => {
    const flat: { chapterId: number; decisionIndex: number; globalIndex: number }[] = [];
    let globalIdx = 0;
    for (const ch of STORY_CHAPTERS) {
      for (let i = 0; i < ch.decisions.length; i++) {
        flat.push({ chapterId: ch.id, decisionIndex: i, globalIndex: globalIdx++ });
      }
    }
    return flat;
  }, []);

  const totalGlobalDecisions = allDecisions.length;

  // State
  const [currentGlobalIdx, setCurrentGlobalIdx] = useState(0);
  const [answers, setAnswers] = useState<StoryAnswer[]>([]);
  const [chapterTransitions, setChapterTransitions] = useState<number[]>([]);

  const current = allDecisions[currentGlobalIdx];
  const currentChapter = STORY_CHAPTERS.find((ch) => ch.id === current?.chapterId)!;
  const chapterDecisions = currentChapter?.decisions || [];

  // Start test
  useEffect(() => {
    if (phase === 'idle') {
      startTest();
      setPhase('testing');
    }
  }, [phase, startTest, setPhase]);

  // Prevent overscroll
  useEffect(() => {
    if (phase !== 'testing') return;
    const el = document.body;
    const prev = el.style.overscrollBehavior;
    el.style.overscrollBehavior = 'none';
    return () => { el.style.overscrollBehavior = prev; };
  }, [phase]);

  // Chapter transition effect
  useEffect(() => {
    if (current && !chapterTransitions.includes(current.chapterId)) {
      setChapterTransitions((prev) => [...prev, current.chapterId]);
    }
  }, [current?.chapterId]);

  const handleAnswer = useCallback((decisionId: string, optionIndex: number) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.decisionId !== decisionId);
      return [...filtered, { decisionId, selectedOption: optionIndex, chapterId: currentChapter.id }];
    });
  }, [currentChapter.id]);

  const handleNext = useCallback(() => {
    if (currentGlobalIdx < totalGlobalDecisions - 1) {
      setCurrentGlobalIdx((p) => p + 1);
      window.scrollTo({ top: 0 });
    }
  }, [currentGlobalIdx, totalGlobalDecisions]);

  const handlePrev = useCallback(() => {
    if (currentGlobalIdx > 0) {
      setCurrentGlobalIdx((p) => p - 1);
      window.scrollTo({ top: 0 });
    }
  }, [currentGlobalIdx]);

  const handleSubmit = useCallback(() => {
    setPhase('processing');

    setTimeout(() => {
      const scores = scoreStoryAnswers(answers);
      const stack = buildFunctionStack(scores);
      const allMatches = computeTypeMatches(scores);
      const quality = checkStoryQuality(answers);
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

      // Save to localStorage
      setTimeout(() => {
        useTestStore.getState().saveResult();
      }, 100);

      navigate(`/result/${resultId}`);
    }, 1200);
  }, [answers, setPhase, setResult, navigate]);

  // Loading state
  if (phase === 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">准备你的旅程...</p>
        </div>
      </div>
    );
  }

  // Processing state
  if (phase === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a0533] via-[#2d1b69] to-[#0f0c29]">
        <div className="text-center px-5">
          <span className="text-5xl mb-6 block animate-bounce">🗼</span>
          <p className="text-lg sm:text-xl text-white/90 font-medium mb-2">
            正在解读你的旅程...
          </p>
          <p className="text-sm text-white/40">
            古塔之镜正在显现你的认知模式
          </p>
          <div className="mt-8 w-32 h-0.5 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-white/40 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  // The last decision of the last chapter — show submit
  const isLastOverall = currentGlobalIdx === totalGlobalDecisions - 1;
  const lastDecisionAnswered = isLastOverall &&
    answers.some((a) => a.decisionId === currentChapter.decisions[current.decisionIndex]?.id);

  return (
    <div className="min-h-screen bg-slate-950">
      <StoryScene
        key={`${current.chapterId}-${current.decisionIndex}`}
        chapter={currentChapter}
        decisionIndex={current.decisionIndex}
        totalDecisions={chapterDecisions.length}
        globalDecisionIndex={currentGlobalIdx}
        totalGlobalDecisions={totalGlobalDecisions}
        answers={answers}
        onAnswer={handleAnswer}
        onNext={lastDecisionAnswered ? handleSubmit : handleNext}
        onPrev={handlePrev}
        isFirstDecision={currentGlobalIdx === 0}
        isLastDecision={isLastOverall}
      />

      {/* Chapter transition overlay */}
      {chapterTransitions.length > 1 && current.decisionIndex === 0 && (
        <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-center animate-in zoom-in-95 duration-700">
            <span className="text-5xl block mb-3">{currentChapter.icon}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{currentChapter.title}</h2>
            <p className="text-sm text-white/40 mt-1">{currentChapter.subtitle}</p>
          </div>
        </div>
      )}
    </div>
  );
}
