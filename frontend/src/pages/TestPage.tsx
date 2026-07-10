import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestStore } from '../store/testStore';
import StoryScene from '../components/StoryScene';
import { scoreStoryAnswers, checkStoryQuality, resolveNextChapter } from '../utils/storyScoring';
import { buildFunctionStack, computeTypeMatches, generateWarnings } from '../utils/scoring';
import { STORY_CHAPTERS } from '../data/scenarios';
import type { StoryAnswer, StoryChapter } from '../types';

/** Find a chapter by ID */
function findChapter(id: number): StoryChapter {
  return STORY_CHAPTERS.find((c) => c.id === id)!;
}

export default function TestPage() {
  const navigate = useNavigate();
  const { phase, setPhase, setResult, startTest } = useTestStore();

  // Path-based navigation: array of chapter IDs visited
  const [path, setPath] = useState<number[]>([1]);
  // Decision index within the current chapter
  const [decisionIdx, setDecisionIdx] = useState(0);
  const [answers, setAnswers] = useState<StoryAnswer[]>([]);
  // Track chapter entries for transition animation
  const [visitedChapters, setVisitedChapters] = useState<Set<number>>(new Set([1]));
  const [showChapterOverlay, setShowChapterOverlay] = useState(false);

  const currentChapter = findChapter(path[path.length - 1]);
  const totalGlobalDecisions = 23; // Each path is ~23 decisions
  // Estimate global progress based on path depth and chapter position
  const estimatedGlobalIdx = (path.length - 1) * 5 + decisionIdx;

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

  // Chapter transition overlay
  useEffect(() => {
    const currentChapterId = path[path.length - 1];
    if (!visitedChapters.has(currentChapterId)) {
      setVisitedChapters((prev) => new Set(prev).add(currentChapterId));
      if (path.length > 1) {
        setShowChapterOverlay(true);
        const timer = setTimeout(() => setShowChapterOverlay(false), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [path]);

  const handleAnswer = useCallback((decisionId: string, optionIndex: number) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.decisionId !== decisionId);
      return [...filtered, { decisionId, selectedOption: optionIndex, chapterId: currentChapter.id }];
    });
  }, [currentChapter.id]);

  const handleNext = useCallback(() => {
    if (decisionIdx < currentChapter.decisions.length - 1) {
      // Advance within current chapter
      setDecisionIdx((p) => p + 1);
      window.scrollTo({ top: 0 });
    } else {
      // Chapter complete — resolve next chapter
      const nextId = resolveNextChapter(currentChapter, answers);
      if (nextId === -1) {
        // Should not happen — ending chapters handled by submit
        handleSubmit();
      } else {
        setPath((p) => [...p, nextId]);
        setDecisionIdx(0);
        window.scrollTo({ top: 0 });
      }
    }
  }, [decisionIdx, currentChapter, answers]);

  const handlePrev = useCallback(() => {
    if (decisionIdx > 0) {
      // Go back within current chapter
      setDecisionIdx((p) => p - 1);
      window.scrollTo({ top: 0 });
    } else if (path.length > 1) {
      // Go back to previous chapter's last decision
      const newPath = path.slice(0, -1);
      const prevChapter = findChapter(newPath[newPath.length - 1]);
      setPath(newPath);
      setDecisionIdx(prevChapter.decisions.length - 1);
      window.scrollTo({ top: 0 });
    }
  }, [decisionIdx, path]);

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

      navigate(`/legacy/result/${resultId}`);
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
          <span className="text-5xl mb-6 block animate-bounce">
            {currentChapter?.icon || '🗼'}
          </span>
          <p className="text-lg sm:text-xl text-white/90 font-medium mb-2">
            正在解读你的旅程...
          </p>
          <p className="text-sm text-white/40">
            {currentChapter?.isEnding
              ? '你的故事已经有了答案'
              : '古塔之镜正在显现你的认知模式'}
          </p>
          <div className="mt-8 w-32 h-0.5 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-white/40 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  const isFirstDecision = path.length === 1 && decisionIdx === 0;
  const isLastDecision = !!currentChapter.isEnding && decisionIdx === currentChapter.decisions.length - 1;
  const isChapterLast = decisionIdx === currentChapter.decisions.length - 1;
  const lastDecisionAnswered = isLastDecision &&
    answers.some((a) => a.decisionId === currentChapter.decisions[decisionIdx]?.id);

  return (
    <div className="min-h-screen bg-slate-950">
      <StoryScene
        key={`${currentChapter.id}-${decisionIdx}`}
        chapter={currentChapter}
        decisionIndex={decisionIdx}
        totalDecisions={currentChapter.decisions.length}
        globalDecisionIndex={estimatedGlobalIdx}
        totalGlobalDecisions={totalGlobalDecisions}
        answers={answers}
        onAnswer={handleAnswer}
        onNext={lastDecisionAnswered ? handleSubmit : isChapterLast ? handleNext : handleNext}
        onPrev={handlePrev}
        isFirstDecision={isFirstDecision}
        isLastDecision={isLastDecision}
        isChapterLast={isChapterLast && !isLastDecision}
      />

      {/* Chapter transition overlay */}
      {showChapterOverlay && (
        <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
          <div className="text-center animate-in fade-in zoom-in-95 duration-700">
            <span className="text-5xl block mb-3">{currentChapter.icon}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{currentChapter.title}</h2>
            <p className="text-sm text-white/40 mt-1">{currentChapter.subtitle}</p>
          </div>
        </div>
      )}
    </div>
  );
}
