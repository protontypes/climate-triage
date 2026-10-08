import type { Repository } from "@/types/types";
import { filterNeedsSupport, getHealthLevel, getHealthScore, needsUrgentSupport } from "../health";

const NOW = new Date("2024-06-01T00:00:00.000Z").getTime();

const makeRepo = (overrides: Partial<Repository> = {}): Repository =>
  ({
    id: "1",
    owner: "org",
    name: "repo",
    description: "test",
    url: "https://github.com/org/repo",
    stars: 10,
    stars_display: "10",
    last_modified: "2024-05-15T00:00:00.000Z",
    language: { id: "python", display: "Python" },
    has_new_issues: false,
    category: { id: "energy", display: "Energy" },
    issues: [],
    monthly_downloads: 0,
    created_at: "2023-01-01T00:00:00.000Z",
    ...overrides
  }) as Repository;

describe("health score", () => {
  it("scores a fresh repo with no issues near 100 (healthy)", () => {
    const { score, level } = getHealthScore(makeRepo(), NOW);
    expect(score).toBe(100);
    expect(level).toBe("healthy");
  });

  it("penalizes open-issue workload (-5 each, capped at -50)", () => {
    const issues = Array.from({ length: 4 }, (_, i) => ({
      id: `${i}`,
      comments_count: 0,
      created_at: "2024-01-01T00:00:00.000Z",
      number: i,
      title: `issue ${i}`,
      labels: [],
      url: "https://example.com"
    }));
    const { score } = getHealthScore(makeRepo({ issues } as Partial<Repository>), NOW);
    expect(score).toBe(80);
  });

  it("penalizes stale repos and flags urgent support", () => {
    const issues = Array.from({ length: 6 }, (_, i) => ({
      id: `${i}`,
      comments_count: 0,
      created_at: "2023-01-01T00:00:00.000Z",
      number: i,
      title: `issue ${i}`,
      labels: [],
      url: "https://example.com"
    }));
    const repo = makeRepo({
      issues,
      last_modified: "2022-01-01T00:00:00.000Z"
    } as Partial<Repository>);
    const { score, level } = getHealthScore(repo, NOW);
    expect(score).toBeLessThan(40);
    expect(level).toBe("needs-support");
    expect(needsUrgentSupport(repo, NOW)).toBe(true);
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
      last_modified: "2022-01-01T00:00:00.000Z",
      issues: Array.from({ length: 6 }, (_, i) => ({
        id: `${i}`,
        comments_count: 0,
        created_at: "2023-01-01T00:00:00.000Z",
        number: i,
        title: `issue ${i}`,
        labels: [],
        url: "https://example.com"
      }))
    } as Partial<Repository>);
    expect(filterNeedsSupport([fresh, stale], NOW).map((r) => r.id)).toEqual(["stale"]);
  });
});
