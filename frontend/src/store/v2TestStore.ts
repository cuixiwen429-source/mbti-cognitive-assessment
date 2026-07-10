import { create } from 'zustand';
import { V2_ASSESSMENT } from '../data/v2Assessment';
import type {
  V2AssessmentDraft,
  V2AssessmentResponse,
  V2AssessmentResult,
  V2HistoryEntry,
  V2StoryEnding,
} from '../types';

const DRAFT_KEY = 'mbti_nineteen_twenty_draft';
const HISTORY_KEY = 'mbti_nineteen_twenty_history';

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The assessment remains usable when storage is unavailable.
  }
}

function createId(prefix: string) {
  const uuid = globalThis.crypto?.randomUUID?.();
  return `${prefix}_${uuid ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
}

function isCurrentDraft(draft: V2AssessmentDraft | null): draft is V2AssessmentDraft {
  return !!draft
    && draft.version.assessment === V2_ASSESSMENT.version.assessment
    && draft.version.itemBank === V2_ASSESSMENT.version.itemBank
    && draft.version.story === V2_ASSESSMENT.version.story
    && draft.version.scoring === V2_ASSESSMENT.version.scoring;
}

interface V2TestState {
  hydrated: boolean;
  draft: V2AssessmentDraft | null;
  result: V2AssessmentResult | null;
  history: V2HistoryEntry[];
  soundEnabled: boolean;
  hydrate: () => void;
  startNew: () => V2AssessmentDraft;
  setCurrentIndex: (index: number) => void;
  recordResponse: (response: V2AssessmentResponse, feedback?: string) => void;
  chooseEnding: (ending: V2StoryEnding) => void;
  setSoundEnabled: (enabled: boolean) => void;
  complete: (result: V2AssessmentResult) => void;
  loadResult: (id: string) => V2AssessmentResult | null;
  discardDraft: () => void;
  deleteHistory: (id: string) => void;
}

export const useV2TestStore = create<V2TestState>((set, get) => ({
  hydrated: false,
  draft: null,
  result: null,
  history: [],
  soundEnabled: false,

  hydrate: () => {
    const storedDraft = safeRead<V2AssessmentDraft | null>(DRAFT_KEY, null);
    const history = safeRead<V2HistoryEntry[]>(HISTORY_KEY, []);
    const draft = isCurrentDraft(storedDraft) ? storedDraft : null;
    if (storedDraft && !draft) {
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
    }
    set({ hydrated: true, draft, history: Array.isArray(history) ? history : [] });
  },

  startNew: () => {
    const now = new Date().toISOString();
    const sessionId = createId('session');
    const draft: V2AssessmentDraft = {
      sessionId,
      seed: sessionId,
      version: V2_ASSESSMENT.version,
      currentIndex: 0,
      responses: [],
      storyState: { unlockedClues: [], feedbackVariants: {} },
      startedAt: now,
      itemStartedAt: now,
    };
    safeWrite(DRAFT_KEY, draft);
    set({ draft, result: null });
    return draft;
  },

  setCurrentIndex: (index) => {
    const draft = get().draft;
    if (!draft) return;
    const updated = {
      ...draft,
      currentIndex: Math.max(0, index),
      itemStartedAt: new Date().toISOString(),
    };
    safeWrite(DRAFT_KEY, updated);
    set({ draft: updated });
  },

  recordResponse: (response, feedback) => {
    const draft = get().draft;
    if (!draft) return;
    const responses = draft.responses.filter((entry) => entry.itemId !== response.itemId);
    responses.push(response);
    const feedbackVariants = feedback
      ? { ...draft.storyState.feedbackVariants, [response.itemId]: feedback }
      : draft.storyState.feedbackVariants;
    const updated: V2AssessmentDraft = {
      ...draft,
      responses,
      storyState: { ...draft.storyState, feedbackVariants },
    };
    safeWrite(DRAFT_KEY, updated);
    set({ draft: updated });
  },

  chooseEnding: (ending) => {
    const draft = get().draft;
    if (!draft) return;
    const updated: V2AssessmentDraft = {
      ...draft,
      storyState: { ...draft.storyState, ending },
    };
    safeWrite(DRAFT_KEY, updated);
    set({ draft: updated });
  },

  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

  complete: (result) => {
    const draft = get().draft;
    const history = get().history;
    const entry: V2HistoryEntry = {
      id: result.resultId,
      createdAt: result.completedAt,
      result,
      responses: draft?.responses ?? [],
    };
    const updatedHistory = [entry, ...history.filter((item) => item.id !== entry.id)].slice(0, 30);
    safeWrite(HISTORY_KEY, updatedHistory);
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
    set({ result, history: updatedHistory, draft: null });
  },

  loadResult: (id) => {
    const current = get().result;
    if (current?.resultId === id) return current;
    return get().history.find((entry) => entry.id === id)?.result ?? null;
  },

  discardDraft: () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
    set({ draft: null, result: null });
  },

  deleteHistory: (id) => {
    const history = get().history.filter((entry) => entry.id !== id);
    safeWrite(HISTORY_KEY, history);
    set({ history });
  },
}));

