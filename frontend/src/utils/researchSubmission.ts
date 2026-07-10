import type {
  V2AssessmentResponse,
  V2AssessmentResult,
} from '../types';

const QUEUE_KEY = 'mbti_nineteen_twenty_research_queue';

export interface V2ResearchPayload {
  schemaVersion: '1';
  idempotencyKey: string;
  submittedAt: string;
  sessionId: string;
  version: V2AssessmentResult['version'];
  durationSeconds: number;
  responses: Array<{
    itemId: string;
    optionId: string;
    presentedOptionIds: string[];
    presentedPosition: number;
    responseTimeMs: number;
    chapterId: string;
  }>;
  quality: V2AssessmentResult['quality'];
}

export type V2SubmissionOutcome = 'submitted' | 'queued';

function readQueue(): V2ResearchPayload[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: V2ResearchPayload[]) {
  try {
    if (queue.length === 0) {
      localStorage.removeItem(QUEUE_KEY);
      return;
    }
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-20)));
  } catch {
    // Research submission must never affect local assessment results.
  }
}

function makePayload(
  result: V2AssessmentResult,
  responses: V2AssessmentResponse[],
): V2ResearchPayload {
  return {
    schemaVersion: '1',
    idempotencyKey: result.resultId,
    submittedAt: new Date().toISOString(),
    sessionId: result.sessionId,
    version: result.version,
    durationSeconds: result.durationSeconds,
    responses: responses.map((response) => ({
      itemId: response.itemId,
      optionId: response.optionId,
      presentedOptionIds: response.presentedOptionIds,
      presentedPosition: response.presentedPosition,
      responseTimeMs: response.responseTimeMs,
      chapterId: response.chapterId,
    })),
    quality: result.quality,
  };
}

function queuePayload(payload: V2ResearchPayload) {
  const queue = readQueue();
  writeQueue([
    ...queue.filter((entry) => entry?.idempotencyKey !== payload.idempotencyKey),
    payload,
  ]);
}

function removeQueuedPayload(idempotencyKey: string) {
  writeQueue(readQueue().filter((entry) => entry.idempotencyKey !== idempotencyKey));
}

function researchEndpoint() {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!baseUrl || !anonKey) return null;
  return {
    url: `${baseUrl.replace(/\/$/, '')}/functions/v1/submit-assessment`,
    anonKey,
  };
}

async function postPayload(payload: V2ResearchPayload) {
  const endpoint = researchEndpoint();
  if (!endpoint) return false;

  const response = await fetch(endpoint.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: endpoint.anonKey,
      Authorization: `Bearer ${endpoint.anonKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Research submission failed with ${response.status}`);
  }
  return true;
}

export async function submitAnonymousResearch(
  result: V2AssessmentResult,
  responses: V2AssessmentResponse[],
): Promise<V2SubmissionOutcome> {
  const payload = makePayload(result, responses);
  if (!researchEndpoint()) {
    queuePayload(payload);
    return 'queued';
  }

  try {
    await postPayload(payload);
    removeQueuedPayload(payload.idempotencyKey);
    return 'submitted';
  } catch (error) {
    queuePayload(payload);
    throw error;
  }
}

export async function retryQueuedResearch(): Promise<{
  submitted: number;
  remaining: number;
}> {
  const queue = readQueue();
  if (queue.length === 0 || !researchEndpoint()) {
    return { submitted: 0, remaining: queue.length };
  }

  const remaining: V2ResearchPayload[] = [];
  let submitted = 0;
  for (const payload of queue) {
    try {
      await postPayload(payload);
      submitted += 1;
    } catch {
      remaining.push(payload);
    }
  }
  writeQueue(remaining);
  return { submitted, remaining: remaining.length };
}
