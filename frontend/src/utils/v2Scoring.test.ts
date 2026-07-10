import { describe, expect, it } from 'vitest';
import { V2_ASSESSMENT, V2_ITEMS } from '../data/v2Assessment';
import type { V2AssessmentResponse, V2StoryEnding } from '../types';
import {
  createV2AssessmentResult,
  getPresentedOptionIds,
  validateCompletedV2Assessment,
  validateV2AssessmentDefinition,
} from './v2Scoring';

function buildResponses(
  seed: string,
  scoredChoice: (scores: Array<number | undefined>) => number,
): V2AssessmentResponse[] {
  return V2_ASSESSMENT.chapters.flatMap((chapter) =>
    chapter.items.map((item, itemIndex) => {
      const presentedOptionIds = getPresentedOptionIds(item, seed);
      const option = item.kind === 'attention'
        ? item.options.find((candidate) => candidate.optionId === item.expectedOptionId)!
        : item.options[scoredChoice(item.options.map((candidate) => candidate.score))];
      return {
        itemId: item.id,
        optionId: option.optionId,
        presentedOptionIds,
        presentedPosition: presentedOptionIds.indexOf(option.optionId),
        responseTimeMs: 5000 + itemIndex,
        chapterId: chapter.id,
        answeredAt: '2026-07-10T12:00:00.000Z',
      };
    }),
  );
}

function createResult(
  responses: V2AssessmentResponse[],
  seed: string,
  ending: V2StoryEnding = 'record',
) {
  return createV2AssessmentResult(V2_ASSESSMENT, responses, {
    resultId: `result_${seed}`,
    sessionId: `session_${seed}`,
    completedAt: '2026-07-10T12:20:00.000Z',
    durationSeconds: 1000,
    ending,
  }, { seed });
}

describe('V2 assessment definition', () => {
  it('contains five coherent chapters, 40 scored items and two attention checks', () => {
    const validation = validateV2AssessmentDefinition(V2_ASSESSMENT);
    expect(validation.valid).toBe(true);
    expect(validation.counts.chapters).toBe(5);
    expect(validation.counts.scoredItems).toBe(40);
    expect(validation.counts.attentionItems).toBe(2);
    expect(validation.counts.byDimension).toEqual({ EI: 10, SN: 10, TF: 10, JP: 10 });
    expect(V2_ITEMS).toHaveLength(42);
    expect(V2_ASSESSMENT.chapters.map((chapter) => chapter.number)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('V2 deterministic scoring', () => {
  it('replays the same answers and seed exactly', () => {
    const seed = 'replay-seed';
    const responses = buildResponses(seed, (scores) => scores.indexOf(2));
    const first = createResult(responses, seed);
    const second = createResult(responses, seed);
    expect(second).toEqual(first);
    expect(first.bestFitType).toBe('INFP');
    expect(first.functionStack).toEqual(['Fi', 'Ne', 'Si', 'Te']);
  });

  it('keeps narrative endings out of measurement', () => {
    const seed = 'ending-seed';
    const responses = buildResponses(seed, (scores) => scores.indexOf(-2));
    const record = createResult(responses, seed, 'record');
    const walk = createResult(responses, seed, 'walk');
    expect(record.bestFitType).toBe('ESTJ');
    expect(walk.dimensionScores).toEqual(record.dimensionScores);
    expect(walk.bestFitType).toBe(record.bestFitType);
    expect(walk.ending).not.toBe(record.ending);
  });

  it('rejects incomplete or duplicate response sets', () => {
    const seed = 'invalid-seed';
    const responses = buildResponses(seed, (scores) => scores.indexOf(1));
    expect(validateCompletedV2Assessment(V2_ASSESSMENT, responses.slice(1), { seed }).valid).toBe(false);
    expect(() => createResult([...responses, responses[0]], seed)).toThrow(/invalid V2 assessment/i);
  });

  it('does not turn a fixed screen position into a stable type', () => {
    const totals = { EI: 0, SN: 0, TF: 0, JP: 0 };
    const sampleCount = 160;
    for (let index = 0; index < sampleCount; index += 1) {
      const seed = `position-${index}`;
      const responses = V2_ASSESSMENT.chapters.flatMap((chapter) =>
        chapter.items.map((item, itemIndex) => {
          const order = getPresentedOptionIds(item, seed);
          const optionId = item.kind === 'attention' ? item.expectedOptionId! : order[0];
          return {
            itemId: item.id,
            optionId,
            presentedOptionIds: order,
            presentedPosition: order.indexOf(optionId),
            responseTimeMs: 4000 + itemIndex,
            chapterId: chapter.id,
            answeredAt: '2026-07-10T12:00:00.000Z',
          } satisfies V2AssessmentResponse;
        }),
      );
      const result = createResult(responses, seed);
      totals.EI += result.dimensionScores.EI.score;
      totals.SN += result.dimensionScores.SN.score;
      totals.TF += result.dimensionScores.TF.score;
      totals.JP += result.dimensionScores.JP.score;
    }

    for (const total of Object.values(totals)) {
      expect(Math.abs(total / sampleCount)).toBeLessThan(10);
    }
  });
});

