import type { Repository } from "@/types/types";
import { filterNeedsSupport, getHealthLevel, getHealthScore, needsUrgentSupport } from "../health";

const NOW = new Date("2024-06-01T00:00:00.000Z").getTime();

// A project that pushed 17 days before NOW, so it counts as active.
const ACTIVE = "2024-05-15T00:00:00.000Z";

const makeRepo = (overrides: Partial<Repository> = {}): Repository =>
  ({
    id: "1",
    owner: "org",
    name: "repo",
    description: "test",
    url: "https://github.com/org/repo",
    stars: 10,
    stars_display: "10",
    last_modified: ACTIVE,
    language: { id: "python", display: "Python" },
    has_new_issues: false,
    category: { id: "energy", display: "Energy" },
    issues: [],
    monthly_downloads: 0,
    created_at: "2023-01-01T00:00:00.000Z",
    open_issues_count: 0,
    total_committers: 10,
    ...overrides
  }) as Repository;

describe("health score", () => {
  it("scores a fresh repo with no issues near 100 (healthy)", () => {
    const { score, level } = getHealthScore(makeRepo(), NOW);
    expect(score).toBe(100);
    expect(level).toBe("healthy");
  });

  it("penalizes workload per developer, not the raw issue count", () => {
    // 40 open issues across 40 committers is 1 issue each: no penalty.
    const spread = getHealthScore(makeRepo({ open_issues_count: 40, total_committers: 40 }), NOW);
    expect(spread.score).toBe(100);

    // The same 40 issues across 4 committers is 10 each: a real burden.
    const concentrated = getHealthScore(
      makeRepo({ open_issues_count: 40, total_committers: 4 }),
      NOW
    );
    expect(concentrated.score).toBeLessThan(spread.score);
  });

  it("counts a single-maintainer project carrying many open issues as needing support", () => {
    const { score, level } = getHealthScore(
      makeRepo({
        open_issues_count: 193,
        total_committers: 1,
        last_modified: "2022-01-01T00:00:00.000Z"
      }),
      NOW
    );
    expect(score).toBeLessThan(40);
    expect(level).toBe("needs-support");
  });

  it("halves the workload penalty on projects that pushed recently", () => {
    // The ecosyste.ms committer count lags the repository HEAD, so an active
    // project is trusted less than a quiet one.
    const active = getHealthScore(makeRepo({ open_issues_count: 193, total_committers: 1 }), NOW);
    const quiet = getHealthScore(
      makeRepo({
        open_issues_count: 193,
        total_committers: 1,
        last_modified: "2022-01-01T00:00:00.000Z"
      }),
      NOW
    );
    expect(active.score).toBeGreaterThan(quiet.score);
  });

  it("falls back to the raw issue count when contributor data is missing", () => {
    const { score } = getHealthScore(
      makeRepo({ open_issues_count: 50, total_committers: null }),
      NOW
    );
    expect(score).toBeLessThan(100);
  });

  it("penalizes stale repos and flags urgent support", () => {
    const repo = makeRepo({
      open_issues_count: 300,
      total_committers: 2,
      last_modified: "2022-01-01T00:00:00.000Z"
    });
    const { score, level } = getHealthScore(repo, NOW);
    expect(score).toBeLessThan(40);
    expect(level).toBe("needs-support");
    expect(needsUrgentSupport(repo, NOW)).toBe(true);
  });

  it("treats new issues as incoming work rather than health", () => {
    const quiet = getHealthScore(
      makeRepo({
        open_issues_count: 0,
        total_committers: 10,
        last_modified: "2022-01-01T00:00:00.000Z"
      }),
      NOW
    );
    const withNewIssues = getHealthScore(
      makeRepo({
        open_issues_count: 0,
        total_committers: 10,
        has_new_issues: true,
        last_modified: "2022-01-01T00:00:00.000Z"
      }),
      NOW
    );
    expect(withNewIssues.score).toBe(quiet.score - 5);
  });

  it("handles invalid dates without crashing", () => {
    const { score } = getHealthScore(makeRepo({ last_modified: "invalid" }), NOW);
    expect(score).toBe(80);
  });

  it("maps score boundaries to levels", () => {
    expect(getHealthLevel(70)).toBe("healthy");
    expect(getHealthLevel(69)).toBe("stable");
    expect(getHealthLevel(40)).toBe("stable");
    expect(getHealthLevel(39)).toBe("needs-support");
  });

  it("filters only repos needing support", () => {
    const fresh = makeRepo({ id: "fresh" });
    const stale = makeRepo({
      id: "stale",
      open_issues_count: 300,
      total_committers: 2,
      last_modified: "2022-01-01T00:00:00.000Z"
    });
    expect(filterNeedsSupport([fresh, stale], NOW).map((r) => r.id)).toEqual(["stale"]);
  });
});
