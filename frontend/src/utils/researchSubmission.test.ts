import { afterEach, describe, expect, it, vi } from 'vitest';
import type { V2AssessmentResponse, V2AssessmentResult } from '../types';
import {
  retryQueuedResearch,
  submitAnonymousResearch,
} from './researchSubmission';

const QUEUE_KEY = 'mbti_nineteen_twenty_research_queue';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const result = {
  resultId: 'result_retry_test',
  sessionId: 'session_retry_test',
  version: {
    assessment: '2.0.0',
    itemBank: '2.0.0',
    story: '2.0.0',
    scoring: '2.0.0',
  },
  durationSeconds: 900,
  quality: { grade: 'high', flags: [] },
} as unknown as V2AssessmentResult;

const responses = [{
  itemId: 'chapter-1-decision-1',
  optionId: 'option-1',
  presentedOptionIds: ['option-1', 'option-2', 'option-3', 'option-4'],
  presentedPosition: 0,
  responseTimeMs: 5200,
  chapterId: 'chapter-1',
  answeredAt: '2026-07-10T12:00:00.000Z',
}] satisfies V2AssessmentResponse[];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('anonymous research retry queue', () => {
  it('keeps a consented payload after failure and removes it after retry', async () => {
    const storage = new MemoryStorage();
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ ok: true, status: 201 });
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'public-anon-key');

    await expect(submitAnonymousResearch(result, responses)).rejects.toThrow('offline');
    expect(JSON.parse(storage.getItem(QUEUE_KEY) ?? '[]')).toHaveLength(1);

    await expect(retryQueuedResearch()).resolves.toEqual({ submitted: 1, remaining: 0 });
    expect(storage.getItem(QUEUE_KEY)).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
