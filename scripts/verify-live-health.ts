/**
 * Prints the live dataset distribution the health score bands are derived from.
 *
 * The PR quotes specific numbers (median and 90th percentile issues per
 * committer, how many projects get flagged). This script recomputes them
 * against the current ecosyste.ms payload so those claims can be re-checked
 * after any band or threshold change.
 *
 *   pnpm verify:health
 */
import { getHealthScore } from "../data/health";
import type { Project } from "../types/apiTypes";
import type { Repository } from "../types/types";

const PROJECTS_URL = "https://ost.ecosyste.ms/api/v1/issues/openclimateaction?per_page=300";

const percentile = (sorted: number[], p: number): number => {
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.min(lower + 1, sorted.length - 1);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};

const round = (value: number): number => Math.round(value * 100) / 100;

async function main() {
  const response = await fetch(PROJECTS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
  }
  const payload = (await response.json()) as Project[];

  const repositories: Repository[] = payload.map((project) => {
    const repository = project.repository;
    return {
      id: String(project.id),
      owner: repository.owner,
      // The curated project name is a display label; full_name is the repository.
      name: repository.full_name,
      url: repository.html_url,
      last_modified: repository.pushed_at,
      has_new_issues: project.has_new_issues,
      open_issues_count: repository.open_issues_count,
      total_committers: repository.commit_stats?.total_committers ?? null
    } as unknown as Repository;
  });

  const withCommitters = repositories.filter((repo) => repo.total_committers != null);
  const ratios = withCommitters
    .map((repo) => (repo.open_issues_count ?? 0) / (repo.total_committers as number))
    .sort((a, b) => a - b);

  console.log(
    `dataset: ${repositories.length} projects, ${withCommitters.length} with commit stats`
  );
  console.log(
    `open issues per committer: median ${round(percentile(ratios, 0.5))}, ` +
      `p75 ${round(percentile(ratios, 0.75))}, ` +
      `p90 ${round(percentile(ratios, 0.9))}, ` +
      `max ${round(ratios[ratios.length - 1])}`
  );

  const now = Date.now();
  const scored = repositories
    .map((repo) => ({ repo, ...getHealthScore(repo, now) }))
    .sort((a, b) => a.score - b.score);

  for (const level of ["healthy", "stable", "needs-support"] as const) {
    console.log(`${level}: ${scored.filter((entry) => entry.level === level).length}`);
  }

  console.log("\nflagged as needs-support:");
  for (const entry of scored.filter((entry) => entry.level === "needs-support")) {
    console.log(
      `  ${entry.repo.name}: score ${entry.score}, ` +
        `${entry.repo.open_issues_count} open issues, ` +
        `${entry.repo.total_committers ?? "no contributor data"} committers, ` +
        `last push ${String(entry.repo.last_modified).slice(0, 10)}`
    );
  }
}

main();
