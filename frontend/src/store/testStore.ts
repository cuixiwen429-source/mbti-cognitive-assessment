import { create } from 'zustand';
import type { Question, Answer, AssessmentResult, HistoryEntry } from '../types';

const HISTORY_STORAGE_KEY = 'mbti_cognitive_history';

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

interface TestState {
  // Test lifecycle
  phase: 'idle' | 'testing' | 'processing' | 'results';
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  result: AssessmentResult | null;
  startTime: number | null;

  // History
  history: HistoryEntry[];

  // Actions
  setPhase: (phase: TestState['phase']) => void;
  setQuestions: (questions: Question[]) => void;
  startTest: () => void;
  submitAnswer: (value: number) => void;
  goToQuestion: (index: number) => void;
  setResult: (result: AssessmentResult) => void;
  reset: () => void;

  // History actions
  saveResult: () => void;
  loadHistoryFromStorage: () => void;
  deleteHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useTestStore = create<TestState>((set, get) => ({
  phase: 'idle',
  questions: [],
  currentIndex: 0,
  answers: [],
  result: null,
  startTime: null,
  history: [],

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

    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
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

  /* ── History actions ── */
  saveResult: () => {
    const { result, startTime } = get();
    if (!result) return;

    const entry: HistoryEntry = {
      id: result.result_id,
      createdAt: new Date().toISOString(),
      durationSeconds: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0,
      result,
    };

    const history = loadHistory();
    // Avoid duplicates — replace if same id
    const filtered = history.filter((e) => e.id !== entry.id);
    const updated = [entry, ...filtered];
    saveHistory(updated);
    set({ history: updated });
  },

  loadHistoryFromStorage: () => {
    const history = loadHistory();
    set({ history });
  },

  deleteHistory: (id: string) => {
    const history = loadHistory().filter((e) => e.id !== id);
    saveHistory(history);
    set({ history });
  },

  clearHistory: () => {
    saveHistory([]);
    set({ history: [] });
  },
}));
