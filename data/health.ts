import type { Repository } from "@/types/types";

export type HealthLevel = "healthy" | "stable" | "needs-support";

export interface HealthScore {
  score: number;
  level: HealthLevel;
}

/**
 * Workload vs. active developers score (0-100).
 *
 * The metric answers issue #56: signal projects that take in a high volume of
 * issues relative to the number of developers able to pick them up.
 *
 * - Workload: open issues per developer. A repo with 200 open issues and 40
 *   committers carries 5 issues each; the same 200 issues in a repo with 3
 *   committers carries 67 each and needs help sooner.
 * - Support capacity: `total_committers` comes from the ecosyste.ms
 *   `commit_stats`, which counts distinct committers. When it is missing, the
 *   workload falls back to the raw open issue count, because an unknown
 *   number of developers is not evidence of an unsupported project.
 * - Staleness: days since the last push. A quiet project with a healthy
 *   issue backlog is not a project in trouble.
 *
 * The workload penalty is halved for projects that pushed within the last
 * 30 days. The ecosyste.ms `commit_stats` lag the repository HEAD on 241 of
 * the 243 projects that carry them, and the committer count they report is
 * systematically lower than the one GitHub reports, because only commits
 * already parsed at sync time are counted. On an active project that
 * undercount turns a well-staffed repo into a false alarm; on a quiet one it
 * is the signal that matters.
 */
export const getHealthScore = (repository: Repository, now: number = Date.now()): HealthScore => {
  const openIssues = repository.open_issues_count ?? 0;
  const committers = repository.total_committers;

  // Without contributor data, score the raw issue count instead of a ratio.
  const workloadPenalty = committers
    ? workloadPerDeveloperPenalty(openIssues / committers)
    : absoluteIssuePenalty(openIssues);

  const lastModified = new Date(repository.last_modified).getTime();
  const daysSincePush = Number.isNaN(lastModified)
    ? Number.NaN
    : (now - lastModified) / (1000 * 60 * 60 * 24);

  let stalenessPenalty: number;
  if (Number.isNaN(lastModified)) {
    stalenessPenalty = 20;
  } else if (daysSincePush <= 30) {
    stalenessPenalty = 0;
  } else if (daysSincePush <= 90) {
    stalenessPenalty = 10;
  } else if (daysSincePush <= 180) {
    stalenessPenalty = 20;
  } else if (daysSincePush <= 365) {
    stalenessPenalty = 30;
  } else {
    stalenessPenalty = 40;
  }

  const activeProject = daysSincePush <= 30;
  let score = 100 - Math.round(workloadPenalty * (activeProject ? 0.5 : 1)) - stalenessPenalty;
  // New issues are incoming work, not a sign of health.
  if (repository.has_new_issues) score -= 5;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, level: getHealthLevel(score) };
};

/**
 * Penalty for open issues per developer. The bands come from the live
 * ecosyste.ms dataset for the openclimateaction set: the median project sits
 * at 2.9 open issues per committer and the 90th percentile at 9.8. A project
 * with 190 open issues and a single committer carries 190 issues alone, and
 * that is the case the metric exists to surface.
 */
const workloadPerDeveloperPenalty = (ratio: number): number => {
  if (ratio <= 2) return 0;
  if (ratio <= 5) return 15;
  if (ratio <= 10) return 35;
  if (ratio <= 25) return 55;
  return 70;
};

/**
 * Penalty for the raw open issue count, used when contributor data is
 * missing. The bands match the workload bands for the same dataset.
 */
const absoluteIssuePenalty = (openIssues: number): number => {
  if (openIssues <= 25) return 0;
  if (openIssues <= 100) return 15;
  if (openIssues <= 300) return 35;
  if (openIssues <= 700) return 55;
  return 70;
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
  const openIssues = repository.open_issues_count ?? 0;
  return openIssues >= 5 && staleDays > 180;
};

export const filterNeedsSupport = (
  repositories: Repository[],
  now: number = Date.now()
): Repository[] => repositories.filter((repo) => needsUrgentSupport(repo, now));
