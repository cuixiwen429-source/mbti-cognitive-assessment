import { create } from 'zustand';
import type { Question, Answer, AssessmentResult } from '../types';

interface TestState {
  // Test lifecycle
  phase: 'idle' | 'testing' | 'processing' | 'results';
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  result: AssessmentResult | null;
  startTime: number | null;

  // Actions
  setPhase: (phase: TestState['phase']) => void;
  setQuestions: (questions: Question[]) => void;
  startTest: () => void;
  submitAnswer: (value: number) => void;
  goToQuestion: (index: number) => void;
  setResult: (result: AssessmentResult) => void;
  reset: () => void;
}

export const useTestStore = create<TestState>((set, get) => ({
  phase: 'idle',
  questions: [],
  currentIndex: 0,
  answers: [],
  result: null,
  startTime: null,

  setPhase: (phase) => set({ phase }),
  setQuestions: (questions) => set({ questions }),

  startTest: () =>
    set({
      phase: 'testing',
      currentIndex: 0,
      answers: [],
      result: null,
      startTime: Date.now(),
    }),

  submitAnswer: (value) => {
    const { questions, currentIndex, answers } = get();
    const question = questions[currentIndex];
    if (!question) return;

    const newAnswers = [...answers];
    const existingIdx = newAnswers.findIndex(
      (a) => a.question_id === question.id
    );
    const answer = { question_id: question.id, value };

    if (existingIdx >= 0) {
      newAnswers[existingIdx] = answer;
    } else {
      newAnswers.push(answer);
    }

    set({ answers: newAnswers });

    // Auto-advance, or submit if last question
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
    // Don't auto-submit — user clicks "提交" on last question
  },

  goToQuestion: (index) => set({ currentIndex: index }),

  setResult: (result) => set({ result, phase: 'results' }),

  reset: () =>
    set({
      phase: 'idle',
      questions: [],
      currentIndex: 0,
      answers: [],
      result: null,
      startTime: null,
    }),
}));
