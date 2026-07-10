import type {
  DimensionBand,
  PreferenceDimension,
  V2AssessmentDefinition,
  V2AssessmentResponse,
  V2AssessmentResult,
  V2DimensionResult,
  V2QualityReport,
  V2StoryEnding,
} from '../types';

export type DeterministicSeed = string | number;

export type V2ValidationSeverity = 'error' | 'warning';

export interface V2ValidationIssue {
  code: string;
  message: string;
  path?: string;
  severity: V2ValidationSeverity;
}

export interface V2DefinitionValidationOptions {
  expectedChapterCount?: number;
  expectedScoredItemCount?: number;
  expectedItemsPerDimension?: number;
  /** Set to null to accept any number of well-formed attention items. */
  expectedAttentionItemCount?: number | null;
}

export interface V2DefinitionValidationResult {
  valid: boolean;
  errors: V2ValidationIssue[];
  warnings: V2ValidationIssue[];
  counts: {
    chapters: number;
    scoredItems: number;
    attentionItems: number;
    byDimension: Record<PreferenceDimension, number>;
  };
}

export interface V2CompletionValidationOptions {
  /** When supplied, every stored presentation order must match the seeded order. */
  seed?: DeterministicSeed;
  definition?: V2DefinitionValidationOptions;
}

export interface V2CompletionValidationResult {
  valid: boolean;
  errors: V2ValidationIssue[];
  warnings: V2ValidationIssue[];
  expectedResponseCount: number;
  receivedResponseCount: number;
  scoredResponseCount: number;
  attentionResponseCount: number;
  missingItemIds: string[];
}

export interface V2TypeDerivation {
  bestFitType: string;
  /** Adjacent candidates only; the best-fit type is intentionally not repeated. */
  candidates: string[];
  uncertainDimensions: PreferenceDimension[];
}

export interface V2ResultMetadata {
  resultId: string;
  sessionId: string;
  completedAt: string;
  durationSeconds: number;
  /** Narrative-only outcome. It is copied to the result and never enters scoring. */
  ending?: V2StoryEnding;
}

type ShuffleableOption = { optionId: string };
type ShuffleableItem<Option extends ShuffleableOption> = {
  id: string;
  options: readonly Option[];
};

const DIMENSIONS = ['EI', 'SN', 'TF', 'JP'] as const satisfies readonly PreferenceDimension[];
const VALID_SCORES = [-2, -1, 1, 2] as const;

const POLES: Record<PreferenceDimension, readonly [string, string]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
};

const DEFAULT_DEFINITION_EXPECTATIONS: Required<V2DefinitionValidationOptions> = {
  expectedChapterCount: 5,
  expectedScoredItemCount: 40,
  expectedItemsPerDimension: 10,
  expectedAttentionItemCount: 2,
};

/**
 * Standard dominant/auxiliary/tertiary/inferior function order.
 * This is a theory-derived lookup, never an independently measured score.
 */
export const MBTI_FUNCTION_STACKS: Readonly<Record<string, readonly string[]>> = {
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
  INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
  ESFP: ['Se', 'Fi', 'Te', 'Ni'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
};

/** Stable 32-bit FNV-1a hash, suitable for deterministic UI ordering (not security). */
export function hashDeterministicSeed(seed: DeterministicSeed): number {
  const source = typeof seed === 'number' ? `n:${String(seed)}` : `s:${seed}`;
  let hash = 0x811c9dc5;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

/** Mulberry32 PRNG. A fresh generator produces the same sequence for the same seed. */
export function createSeededRandom(seed: DeterministicSeed): () => number {
  let state = hashDeterministicSeed(seed);

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic Fisher-Yates shuffle. The source array is never mutated.
 * Length-prefixed seed parts prevent ambiguous combinations such as `ab:c`/`a:bc`.
 */
export function deterministicShuffle<T>(
  values: readonly T[],
  seed: DeterministicSeed,
  namespace = '',
): T[] {
  const serializedSeed = typeof seed === 'number' ? `n:${String(seed)}` : `s:${seed}`;
  const compoundSeed = `${serializedSeed.length}:${serializedSeed}|${namespace.length}:${namespace}`;
  const random = createSeededRandom(compoundSeed);
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

/** Each item gets its own stable shuffle, so adding another item cannot reorder existing ones. */
export function getPresentedOptions<Option extends ShuffleableOption>(
  item: ShuffleableItem<Option>,
  seed: DeterministicSeed,
): Option[] {
  return deterministicShuffle(item.options, seed, `assessment-item:${item.id}`);
}

export function getPresentedOptionIds<Option extends ShuffleableOption>(
  item: ShuffleableItem<Option>,
  seed: DeterministicSeed,
): string[] {
  return getPresentedOptions(item, seed).map((option) => option.optionId);
}

export function classifyDimensionBand(score: number): DimensionBand {
  const magnitude = Math.abs(score);
  if (magnitude < 15) return 'balanced';
  if (magnitude < 35) return 'leaning';
  return 'clear';
}

export function validateV2AssessmentDefinition(
  definition: V2AssessmentDefinition,
  options: V2DefinitionValidationOptions = {},
): V2DefinitionValidationResult {
  const expectations = { ...DEFAULT_DEFINITION_EXPECTATIONS, ...options };
  const errors: V2ValidationIssue[] = [];
  const warnings: V2ValidationIssue[] = [];
  const byDimension: Record<PreferenceDimension, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const itemIds = new Set<string>();
  const chapterIds = new Set<string>();
  let scoredItems = 0;
  let attentionItems = 0;

  const addError = (code: string, message: string, path?: string) => {
    errors.push({ code, message, path, severity: 'error' });
  };
  const addWarning = (code: string, message: string, path?: string) => {
    warnings.push({ code, message, path, severity: 'warning' });
  };

  if (!isStableId(definition.id)) {
    addError('definition.id.invalid', 'Assessment definition id must be a non-empty stable id.', 'id');
  }

  const versionEntries = Object.entries(definition.version);
  if (versionEntries.length === 0 || versionEntries.some(([, value]) => !isStableId(value))) {
    addError(
      'definition.version.invalid',
      'Every assessment, content, and scoring version must be a non-empty string.',
      'version',
    );
  }

  if (definition.chapters.length !== expectations.expectedChapterCount) {
    addError(
      'definition.chapter-count',
      `Expected ${expectations.expectedChapterCount} chapters, received ${definition.chapters.length}.`,
      'chapters',
    );
  }

  definition.chapters.forEach((chapter, chapterIndex) => {
    const chapterPath = `chapters[${chapterIndex}]`;
    if (!isStableId(chapter.id)) {
      addError('chapter.id.invalid', 'Chapter id must be a non-empty stable id.', `${chapterPath}.id`);
    } else if (chapterIds.has(chapter.id)) {
      addError('chapter.id.duplicate', `Duplicate chapter id "${chapter.id}".`, `${chapterPath}.id`);
    } else {
      chapterIds.add(chapter.id);
    }

    chapter.items.forEach((item, itemIndex) => {
      const itemPath = `${chapterPath}.items[${itemIndex}]`;
      if (!isStableId(item.id)) {
        addError('item.id.invalid', 'Item id must be a non-empty stable id.', `${itemPath}.id`);
      } else if (itemIds.has(item.id)) {
        addError('item.id.duplicate', `Duplicate item id "${item.id}".`, `${itemPath}.id`);
      } else {
        itemIds.add(item.id);
      }

      const optionIds = new Set<string>();
      item.options.forEach((option, optionIndex) => {
        const optionPath = `${itemPath}.options[${optionIndex}]`;
        if (!isStableId(option.optionId)) {
          addError('option.id.invalid', 'Option id must be a non-empty stable id.', `${optionPath}.optionId`);
        } else if (optionIds.has(option.optionId)) {
          addError(
            'option.id.duplicate',
            `Duplicate option id "${option.optionId}" within item "${item.id}".`,
            `${optionPath}.optionId`,
          );
        } else {
          optionIds.add(option.optionId);
        }
      });

      if (item.kind === 'scored') {
        scoredItems += 1;

        if (!item.dimension || !isPreferenceDimension(item.dimension)) {
          addError('item.dimension.invalid', 'Every scored item must target one dimension.', `${itemPath}.dimension`);
        } else {
          byDimension[item.dimension] += 1;
        }

        if (item.options.length !== VALID_SCORES.length) {
          addError(
            'item.option-count',
            `Scored item "${item.id}" must have exactly four options.`,
            `${itemPath}.options`,
          );
        }

        const scores = item.options.map((option) => option.score).sort((left, right) => (left ?? 0) - (right ?? 0));
        if (!sameNumberArray(scores, VALID_SCORES)) {
          addError(
            'item.option-scores',
            `Scored item "${item.id}" must contain each weight exactly once: -2, -1, +1, +2.`,
            `${itemPath}.options`,
          );
        }
      } else if (item.kind === 'attention') {
        attentionItems += 1;
        if (!isStableId(item.expectedOptionId)) {
          addError(
            'attention.expected-option.missing',
            `Attention item "${item.id}" must declare expectedOptionId.`,
            `${itemPath}.expectedOptionId`,
          );
        } else if (!optionIds.has(item.expectedOptionId)) {
          addError(
            'attention.expected-option.unknown',
            `Attention item "${item.id}" refers to an unknown expected option.`,
            `${itemPath}.expectedOptionId`,
          );
        }
      } else {
        addError('item.kind.invalid', `Unknown item kind on "${item.id}".`, `${itemPath}.kind`);
      }
    });
  });

  if (scoredItems !== expectations.expectedScoredItemCount) {
    addError(
      'definition.scored-count',
      `Expected ${expectations.expectedScoredItemCount} scored items, received ${scoredItems}.`,
      'chapters',
    );
  }

  for (const dimension of DIMENSIONS) {
    if (byDimension[dimension] !== expectations.expectedItemsPerDimension) {
      addError(
        'definition.dimension-count',
        `Expected ${expectations.expectedItemsPerDimension} ${dimension} items, received ${byDimension[dimension]}.`,
        'chapters',
      );
    }
  }

  if (
    expectations.expectedAttentionItemCount !== null
    && attentionItems !== expectations.expectedAttentionItemCount
  ) {
    addError(
      'definition.attention-count',
      `Expected ${expectations.expectedAttentionItemCount} attention items, received ${attentionItems}.`,
      'chapters',
    );
  }

  const consistencyPairIds = new Set<string>();
  for (const [pairIndex, pair] of (definition.consistencyPairs ?? []).entries()) {
    const pairPath = `consistencyPairs[${pairIndex}]`;
    if (!isStableId(pair.id)) {
      addError('consistency.id.invalid', 'Consistency pair id must be a non-empty stable id.', `${pairPath}.id`);
    } else if (consistencyPairIds.has(pair.id)) {
      addError('consistency.id.duplicate', `Duplicate consistency pair id "${pair.id}".`, `${pairPath}.id`);
    } else {
      consistencyPairIds.add(pair.id);
    }

    const [leftItemId, rightItemId] = pair.itemIds;
    if (pair.relation !== 'same' && pair.relation !== 'opposite') {
      addError(
        'consistency.relation.invalid',
        `Consistency pair "${pair.id}" must declare a same or opposite relation.`,
        `${pairPath}.relation`,
      );
    }
    if (leftItemId === rightItemId) {
      addError('consistency.self-pair', 'A consistency pair must reference two different items.', `${pairPath}.itemIds`);
    }
    if (!itemIds.has(leftItemId) || !itemIds.has(rightItemId)) {
      addError(
        'consistency.item.unknown',
        `Consistency pair "${pair.id}" references an unknown item.`,
        `${pairPath}.itemIds`,
      );
    }

    const leftItem = findItem(definition, leftItemId);
    const rightItem = findItem(definition, rightItemId);
    if (leftItem?.kind !== 'scored' || rightItem?.kind !== 'scored') {
      addError(
        'consistency.item.not-scored',
        `Consistency pair "${pair.id}" must reference two scored items.`,
        `${pairPath}.itemIds`,
      );
    } else if (leftItem.dimension !== rightItem.dimension) {
      addWarning(
        'consistency.dimension.mismatch',
        `Consistency pair "${pair.id}" compares different dimensions and will be ignored.`,
        `${pairPath}.itemIds`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    counts: {
      chapters: definition.chapters.length,
      scoredItems,
      attentionItems,
      byDimension,
    },
  };
}

export function validateCompletedV2Assessment(
  definition: V2AssessmentDefinition,
  responses: readonly V2AssessmentResponse[],
  options: V2CompletionValidationOptions = {},
): V2CompletionValidationResult {
  const definitionValidation = validateV2AssessmentDefinition(definition, options.definition);
  const errors = [...definitionValidation.errors];
  const warnings = [...definitionValidation.warnings];
  const itemEntries = definition.chapters.flatMap((chapter) =>
    chapter.items.map((item) => ({ chapterId: chapter.id, item })),
  );
  const entriesById = new Map(itemEntries.map((entry) => [entry.item.id, entry]));
  const responseItemIds = new Set<string>();
  let scoredResponseCount = 0;
  let attentionResponseCount = 0;

  const addError = (code: string, message: string, path?: string) => {
    errors.push({ code, message, path, severity: 'error' });
  };

  responses.forEach((response, responseIndex) => {
    const responsePath = `responses[${responseIndex}]`;
    const entry = entriesById.get(response.itemId);

    if (!entry) {
      addError(
        'response.item.unknown',
        `Response refers to unknown item "${response.itemId}".`,
        `${responsePath}.itemId`,
      );
      return;
    }

    if (responseItemIds.has(response.itemId)) {
      addError(
        'response.item.duplicate',
        `More than one response was supplied for item "${response.itemId}".`,
        `${responsePath}.itemId`,
      );
      return;
    }
    responseItemIds.add(response.itemId);

    if (entry.item.kind === 'scored') scoredResponseCount += 1;
    if (entry.item.kind === 'attention') attentionResponseCount += 1;

    if (response.chapterId !== entry.chapterId) {
      addError(
        'response.chapter.mismatch',
        `Response for "${response.itemId}" records the wrong chapter.`,
        `${responsePath}.chapterId`,
      );
    }

    const validOptionIds = entry.item.options.map((option) => option.optionId);
    if (!validOptionIds.includes(response.optionId)) {
      addError(
        'response.option.unknown',
        `Response for "${response.itemId}" selects unknown option "${response.optionId}".`,
        `${responsePath}.optionId`,
      );
    }

    if (!sameStringSet(response.presentedOptionIds, validOptionIds)) {
      addError(
        'response.presentation.invalid',
        `Presented option ids for "${response.itemId}" must contain every option exactly once.`,
        `${responsePath}.presentedOptionIds`,
      );
    }

    if (
      !Number.isInteger(response.presentedPosition)
      || response.presentedPosition < 0
      || response.presentedPosition >= response.presentedOptionIds.length
      || response.presentedOptionIds[response.presentedPosition] !== response.optionId
    ) {
      addError(
        'response.presentation.position',
        `Presented position for "${response.itemId}" does not point to the selected option.`,
        `${responsePath}.presentedPosition`,
      );
    }

    if (options.seed !== undefined) {
      const expectedOrder = getPresentedOptionIds(entry.item, options.seed);
      if (!sameStringArray(response.presentedOptionIds, expectedOrder)) {
        addError(
          'response.presentation.seed-mismatch',
          `Presented order for "${response.itemId}" does not match the stored seed.`,
          `${responsePath}.presentedOptionIds`,
        );
      }
    }

    if (!Number.isFinite(response.responseTimeMs) || response.responseTimeMs < 0) {
      addError(
        'response.time.invalid',
        `Response time for "${response.itemId}" must be a finite non-negative number.`,
        `${responsePath}.responseTimeMs`,
      );
    }

    if (!isIsoDate(response.answeredAt)) {
      addError(
        'response.answered-at.invalid',
        `Response time stamp for "${response.itemId}" must be an ISO date.`,
        `${responsePath}.answeredAt`,
      );
    }
  });

  const missingItemIds = itemEntries
    .map(({ item }) => item.id)
    .filter((itemId) => !responseItemIds.has(itemId));
  for (const itemId of missingItemIds) {
    addError('response.item.missing', `Missing response for item "${itemId}".`, 'responses');
  }

  if (responses.length !== itemEntries.length) {
    addError(
      'response.count',
      `Expected exactly ${itemEntries.length} responses, received ${responses.length}.`,
      'responses',
    );
  }

  if (scoredResponseCount !== 40) {
    addError(
      'response.scored-count',
      `Expected exactly 40 unique scored responses, received ${scoredResponseCount}.`,
      'responses',
    );
  }

  if (attentionResponseCount !== definitionValidation.counts.attentionItems) {
    addError(
      'response.attention-count',
      `Expected ${definitionValidation.counts.attentionItems} unique attention responses, received ${attentionResponseCount}.`,
      'responses',
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    expectedResponseCount: itemEntries.length,
    receivedResponseCount: responses.length,
    scoredResponseCount,
    attentionResponseCount,
    missingItemIds,
  };
}

export function scoreV2Dimensions(
  definition: V2AssessmentDefinition,
  responses: readonly V2AssessmentResponse[],
  validationOptions: V2CompletionValidationOptions = {},
): Record<PreferenceDimension, V2DimensionResult> {
  const validation = validateCompletedV2Assessment(definition, responses, validationOptions);
  assertValidCompletion(validation);

  const responseByItemId = new Map(responses.map((response) => [response.itemId, response]));
  const totals: Record<PreferenceDimension, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const maximums: Record<PreferenceDimension, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

  for (const chapter of definition.chapters) {
    for (const item of chapter.items) {
      if (item.kind !== 'scored' || !item.dimension) continue;
      const response = responseByItemId.get(item.id);
      const option = item.options.find((candidate) => candidate.optionId === response?.optionId);
      if (!response || option?.score === undefined) {
        throw new Error(`Validated response for scored item "${item.id}" could not be resolved.`);
      }

      totals[item.dimension] += option.score;
      maximums[item.dimension] += Math.max(...item.options.map((candidate) => Math.abs(candidate.score ?? 0)));
    }
  }

  return Object.fromEntries(
    DIMENSIONS.map((dimension) => {
      const maximum = maximums[dimension];
      const score = maximum === 0 ? 0 : roundTo(totals[dimension] / maximum * 100, 1);
      const [negativePole, positivePole] = POLES[dimension];
      const result: V2DimensionResult = {
        dimension,
        score: clamp(score, -100, 100),
        band: classifyDimensionBand(score),
        negativePole,
        positivePole,
      };
      return [dimension, result];
    }),
  ) as Record<PreferenceDimension, V2DimensionResult>;
}

export function deriveV2Type(
  dimensionScores: Record<PreferenceDimension, V2DimensionResult>,
): V2TypeDerivation {
  const uncertainDimensions = DIMENSIONS.filter(
    (dimension) => dimensionScores[dimension].band === 'balanced',
  );
  const baseLetters = DIMENSIONS.map((dimension) => {
    const score = dimensionScores[dimension].score;
    return POLES[dimension][score > 0 ? 1 : 0];
  });
  const bestFitType = baseLetters.join('');
  const candidates: string[] = [];

  // Enumerating all combinations avoids implying certainty when several axes are balanced.
  for (let flippedCount = 1; flippedCount <= uncertainDimensions.length; flippedCount += 1) {
    for (let mask = 1; mask < 2 ** uncertainDimensions.length; mask += 1) {
      if (countSetBits(mask) !== flippedCount) continue;
      const letters = [...baseLetters];

      uncertainDimensions.forEach((dimension, uncertainIndex) => {
        if ((mask & (1 << uncertainIndex)) === 0) return;
        const dimensionIndex = DIMENSIONS.indexOf(dimension);
        const currentPoleIndex = letters[dimensionIndex] === POLES[dimension][0] ? 0 : 1;
        letters[dimensionIndex] = POLES[dimension][currentPoleIndex === 0 ? 1 : 0];
      });
      candidates.push(letters.join(''));
    }
  }

  return { bestFitType, candidates, uncertainDimensions };
}

export function getV2FunctionStack(typeCode: string): string[] {
  const stack = MBTI_FUNCTION_STACKS[typeCode];
  if (!stack) throw new Error(`Unknown MBTI type "${typeCode}".`);
  return [...stack];
}

export function evaluateV2Quality(
  definition: V2AssessmentDefinition,
  responses: readonly V2AssessmentResponse[],
  validationOptions: V2CompletionValidationOptions = {},
): V2QualityReport {
  const validation = validateCompletedV2Assessment(definition, responses, validationOptions);
  const expectedItems = definition.chapters.flatMap((chapter) => chapter.items);
  const knownItemIds = new Set(expectedItems.map((item) => item.id));
  const uniqueKnownResponses = new Map<string, V2AssessmentResponse>();
  for (const response of responses) {
    if (knownItemIds.has(response.itemId) && !uniqueKnownResponses.has(response.itemId)) {
      uniqueKnownResponses.set(response.itemId, response);
    }
  }

  const completionRate = expectedItems.length === 0
    ? 0
    : roundTo(Math.min(1, uniqueKnownResponses.size / expectedItems.length), 3);
  const responseTimes = [...uniqueKnownResponses.values()]
    .map((response) => response.responseTimeMs)
    .filter((time) => Number.isFinite(time) && time >= 0);
  const fastResponseCount = responseTimes.filter((time) => time < 1500).length;
  const fastResponseRatio = responseTimes.length === 0
    ? 0
    : roundTo(fastResponseCount / responseTimes.length, 3);

  const attentionItems = expectedItems.filter((item) => item.kind === 'attention');
  let attentionCorrect = 0;
  for (const item of attentionItems) {
    const response = uniqueKnownResponses.get(item.id);
    if (response && response.optionId === item.expectedOptionId) attentionCorrect += 1;
  }
  const attentionTotal = attentionItems.length;
  const attentionPassed = attentionTotal === 0 || attentionCorrect === attentionTotal;

  const itemById = new Map(expectedItems.map((item) => [item.id, item]));
  let consistentPairs = 0;
  let validConsistencyPairs = 0;
  for (const pair of definition.consistencyPairs ?? []) {
    const [leftItemId, rightItemId] = pair.itemIds;
    const leftItem = itemById.get(leftItemId);
    const rightItem = itemById.get(rightItemId);
    const leftResponse = uniqueKnownResponses.get(leftItemId);
    const rightResponse = uniqueKnownResponses.get(rightItemId);
    if (
      leftItem?.kind !== 'scored'
      || rightItem?.kind !== 'scored'
      || leftItem.dimension !== rightItem.dimension
      || !leftResponse
      || !rightResponse
    ) continue;

    const leftScore = leftItem.options.find((option) => option.optionId === leftResponse.optionId)?.score;
    const rightScore = rightItem.options.find((option) => option.optionId === rightResponse.optionId)?.score;
    if (leftScore === undefined || rightScore === undefined) continue;

    validConsistencyPairs += 1;
    const sameDirection = Math.sign(leftScore) === Math.sign(rightScore);
    if ((pair.relation === 'same' && sameDirection) || (pair.relation === 'opposite' && !sameDirection)) {
      consistentPairs += 1;
    }
  }
  const consistencyScore = validConsistencyPairs === 0
    ? null
    : roundTo(consistentPairs / validConsistencyPairs, 3);

  const flags = new Set<string>();
  if (completionRate < 1) flags.add('assessment-incomplete');
  if (!validation.valid) flags.add('invalid-response-data');
  if (attentionTotal === 0) flags.add('attention-not-measured');
  else if (!attentionPassed) flags.add('attention-check-missed');
  if (responseTimes.length < uniqueKnownResponses.size) flags.add('response-time-missing');
  if (fastResponseRatio >= 0.2) flags.add('many-fast-responses');
  if (consistencyScore === null) flags.add('consistency-not-measured');
  else if (validConsistencyPairs < 2) flags.add('consistency-evidence-limited');
  else if (consistencyScore < 0.75) flags.add('low-declared-consistency');

  let grade: V2QualityReport['grade'];
  if (completionRate < 1 || !validation.valid || responseTimes.length === 0) {
    grade = 'insufficient';
  } else if (
    (attentionTotal > 0 && attentionCorrect === 0)
    || fastResponseRatio >= 0.5
    || (consistencyScore !== null && consistencyScore < 0.5)
  ) {
    grade = 'low';
  } else if (
    !attentionPassed
    || fastResponseRatio >= 0.2
    || responseTimes.length < uniqueKnownResponses.size
    || consistencyScore === null
    || validConsistencyPairs < 2
    || consistencyScore < 0.75
  ) {
    grade = 'medium';
  } else {
    grade = 'high';
  }

  return {
    grade,
    attentionCorrect,
    attentionTotal,
    attentionPassed,
    completionRate,
    fastResponseRatio,
    consistencyScore,
    validConsistencyPairs,
    flags: [...flags],
  };
}

/**
 * Builds the versioned result. Metadata is explicit to keep this utility pure and replayable.
 * Invalid, incomplete, duplicate, or unknown responses are rejected before scoring.
 */
export function createV2AssessmentResult(
  definition: V2AssessmentDefinition,
  responses: readonly V2AssessmentResponse[],
  metadata: V2ResultMetadata,
  validationOptions: V2CompletionValidationOptions = {},
): V2AssessmentResult {
  const validation = validateCompletedV2Assessment(definition, responses, validationOptions);
  assertValidCompletion(validation);

  if (!isStableId(metadata.resultId)) throw new Error('resultId must be a non-empty stable id.');
  if (!isStableId(metadata.sessionId)) throw new Error('sessionId must be a non-empty stable id.');
  if (!isIsoDate(metadata.completedAt)) throw new Error('completedAt must be an ISO date.');
  if (!Number.isFinite(metadata.durationSeconds) || metadata.durationSeconds < 0) {
    throw new Error('durationSeconds must be a finite non-negative number.');
  }

  const dimensionScores = scoreV2Dimensions(definition, responses, validationOptions);
  const type = deriveV2Type(dimensionScores);

  return {
    resultId: metadata.resultId,
    sessionId: metadata.sessionId,
    version: { ...definition.version },
    completedAt: metadata.completedAt,
    durationSeconds: metadata.durationSeconds,
    dimensionScores,
    bestFitType: type.bestFitType,
    candidates: type.candidates,
    uncertainDimensions: type.uncertainDimensions,
    functionStack: getV2FunctionStack(type.bestFitType),
    quality: evaluateV2Quality(definition, responses, validationOptions),
    ending: metadata.ending,
  };
}

function assertValidCompletion(validation: V2CompletionValidationResult): void {
  if (validation.valid) return;
  const summary = validation.errors
    .slice(0, 5)
    .map((issue) => `${issue.code}: ${issue.message}`)
    .join('; ');
  const suffix = validation.errors.length > 5 ? `; +${validation.errors.length - 5} more` : '';
  throw new Error(`Cannot score invalid V2 assessment. ${summary}${suffix}`);
}

function findItem(definition: V2AssessmentDefinition, itemId: string) {
  for (const chapter of definition.chapters) {
    const item = chapter.items.find((candidate) => candidate.id === itemId);
    if (item) return item;
  }
  return undefined;
}

function isPreferenceDimension(value: string): value is PreferenceDimension {
  return (DIMENSIONS as readonly string[]).includes(value);
}

function isStableId(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isIsoDate(value: string): boolean {
  if (!value || Number.isNaN(Date.parse(value))) return false;
  return /^\d{4}-\d{2}-\d{2}T/.test(value);
}

function sameNumberArray(
  values: readonly (number | undefined)[],
  expected: readonly number[],
): boolean {
  return values.length === expected.length && values.every((value, index) => value === expected[index]);
}

function sameStringArray(values: readonly string[], expected: readonly string[]): boolean {
  return values.length === expected.length && values.every((value, index) => value === expected[index]);
}

function sameStringSet(values: readonly string[], expected: readonly string[]): boolean {
  return new Set(values).size === values.length
    && values.length === expected.length
    && expected.every((value) => values.includes(value));
}

function countSetBits(value: number): number {
  let remaining = value;
  let count = 0;
  while (remaining > 0) {
    count += remaining & 1;
    remaining >>>= 1;
  }
  return count;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
