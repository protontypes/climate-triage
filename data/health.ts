import type { Repository } from "@/types/types";

export type HealthLevel = "healthy" | "stable" | "needs-support";

export interface HealthScore {
  score: number;
  level: HealthLevel;
}

/**
 * Workload vs. freshness score (0-100).
 *
 * - Issue burden: -5 per open issue, capped at -50.
 * - Staleness (days since last_modified): <=30: 0, <=90: -10,
 *   <=180: -20, <=365: -30, >365: -40, invalid date: -20.
 * - has_new_issues=true: +5 (capped at 100).
 */
export const getHealthScore = (repository: Repository, now: number = Date.now()): HealthScore => {
  const openIssues = repository.issues?.length ?? 0;
  const issuePenalty = Math.min(openIssues, 10) * 5;

  const lastModified = new Date(repository.last_modified).getTime();
  let stalenessPenalty: number;
  if (Number.isNaN(lastModified)) {
    stalenessPenalty = 20;
  } else {
    const days = (now - lastModified) / (1000 * 60 * 60 * 24);
    if (days <= 30) stalenessPenalty = 0;
    else if (days <= 90) stalenessPenalty = 10;
    else if (days <= 180) stalenessPenalty = 20;
    else if (days <= 365) stalenessPenalty = 30;
    else stalenessPenalty = 40;
  }

  let score = 100 - issuePenalty - stalenessPenalty;
  if (repository.has_new_issues) score += 5;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, level: getHealthLevel(score) };
};

export const getHealthLevel = (score: number): HealthLevel => {
  if (score >= 70) return "healthy";
  if (score >= 40) return "stable";
  return "needs-support";
};

export const needsUrgentSupport = (repository: Repository, now: number = Date.now()): boolean => {
  const { score } = getHealthScore(repository, now);
  if (score < 40) return true;
  const lastModified = new Date(repository.last_modified).getTime();
  const staleDays = Number.isNaN(lastModified) ? 0 : (now - lastModified) / (1000 * 60 * 60 * 24);
  return (repository.issues?.length ?? 0) >= 5 && staleDays > 180;
};

export const filterNeedsSupport = (
  repositories: Repository[],
  now: number = Date.now()
): Repository[] => repositories.filter((repo) => needsUrgentSupport(repo, now));
