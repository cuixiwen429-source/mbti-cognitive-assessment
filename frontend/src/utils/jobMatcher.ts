/**
 * Job matching engine — weighted cosine similarity between user's
 * cognitive function profile and job function requirements.
 */
import type { FunctionScores, JobMatchResult } from '../types';
import { FUNC_NAMES } from '../types';
import { JOB_DATABASE } from '../data/jobs';

/**
 * Weighted cosine similarity — emphasizes dominant functions over weak ones.
 * - Uses user's actual scores (not normalized) for weighting
 * - Higher weight on functions that are strong for both user and job
 */
function weightedCosineSimilarity(
  user: Record<string, number>,
  job: FunctionScores,
): number {
  const j = job as unknown as Record<string, number>;

  // Compute weighted dot product and magnitudes
  let dotProduct = 0;
  let userMag = 0;
  let jobMag = 0;

  for (const f of FUNC_NAMES) {
    const u = user[f] / 100; // normalize to 0-1
    const r = j[f];

    // Weight by user's score — stronger functions count more
    const w = 0.5 + 0.5 * u;

    dotProduct += w * u * r;
    userMag += w * u * u;
    jobMag += r * r;
  }

  if (userMag === 0 || jobMag === 0) return 0;
  const cosine = dotProduct / (Math.sqrt(userMag) * Math.sqrt(jobMag));

  // Scale to 0-100
  return Math.round(Math.max(0, Math.min(100, cosine * 100)));
}

export function matchJobs(scores: Record<string, number>): JobMatchResult[] {
  const results: JobMatchResult[] = JOB_DATABASE.map((job) => ({
    ...job,
    matchScore: weightedCosineSimilarity(scores, job.functionRequirements),
  }));

  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}

/**
 * Get top N matches, optionally filtering by confidence level.
 */
export function getTopMatches(
  scores: Record<string, number>,
  limit = 20,
  minConfidence = 1,
): JobMatchResult[] {
  return matchJobs(scores)
    .filter((j) => j.confidence >= minConfidence)
    .slice(0, limit);
}

/**
 * Get matches grouped by confidence tier for display.
 */
export function getGroupedMatches(scores: Record<string, number>) {
  const all = matchJobs(scores);

  return {
    highConfidence: all.filter((j) => j.confidence === 3).slice(0, 5),
    mediumConfidence: all.filter((j) => j.confidence === 2).slice(0, 10),
    lowConfidence: all.filter((j) => j.confidence === 1).slice(0, 5),
    top: all.slice(0, 10),
  };
}
