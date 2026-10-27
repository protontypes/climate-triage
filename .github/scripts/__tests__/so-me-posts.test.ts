import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The script needs jq, it is not installed everywhere. The tests are skipped
// when it is missing instead of failing.
const hasJq = (() => {
  const result = spawnSync("jq", ["--version"], { encoding: "utf8" });
  return result.status === 0;
})();

const SCRIPT = join(process.cwd(), ".github/scripts/so-me-posts.sh");

// The issues of the API are used as they are, only the fields the script reads
// are filled in.
type Issue = {
  uuid: string;
  title: string;
  created_at: string;
  labels: string[];
  html_url: string;
  state: string;
  project: { name: string; language: string } | null;
};

type Post = {
  uuid: string;
  url: string;
  text: string;
};

const issue = (overrides: Partial<Issue> = {}): Issue => ({
  uuid: "1",
  title: "A good first issue",
  created_at: "2026-10-20T10:00:00.000Z",
  labels: ["good first issue"],
  html_url: "https://github.com/example/project/issues/1",
  state: "open",
  project: { name: "Project", language: "TypeScript" },
  ...overrides
});

const run = (args: string[], env: Record<string, string> = {}) => {
  const result = spawnSync("bash", [SCRIPT, ...args], {
    encoding: "utf8",
    env: { ...process.env, ...env }
  });
  if (result.status !== 0) {
    throw new Error(`so-me-posts.sh ${args.join(" ")} failed: ${result.stderr}`);
  }
  return { stdout: result.stdout, stderr: result.stderr };
};

const workspace = (issues: Issue[], state?: unknown) => {
  const dir = mkdtempSync(join(tmpdir(), "so-me-posts-"));
  const files = {
    dir,
    issues: join(dir, "issues.json"),
    state: join(dir, "state.json"),
    posts: join(dir, "posts.json"),
    selection: join(dir, "selection.json")
  };
  writeFileSync(files.issues, JSON.stringify(issues));
  if (state !== undefined) {
    writeFileSync(files.state, typeof state === "string" ? state : JSON.stringify(state));
  }
  return files;
};

const select = (
  issues: Issue[],
  state?: unknown,
  env: Record<string, string> = {}
): { files: ReturnType<typeof workspace>; posts: Post[]; count: string; stderr: string } => {
  const files = workspace(issues, state);
  const { stdout, stderr } = run(["select", files.issues, files.state, files.posts], {
    CUTOFF: "2026-10-01T00:00:00.000Z",
    ...env
  });
  return {
    files,
    posts: JSON.parse(readFileSync(files.posts, "utf8")) as Post[],
    count: stdout.trim(),
    stderr
  };
};

const reserve = (files: ReturnType<typeof workspace>) => {
  run(["reserve", files.state, files.posts]);
  return JSON.parse(readFileSync(files.state, "utf8"));
};

const record = (
  selection: unknown,
  posted: string[],
  state?: unknown
): { posted: string[]; reserved: string[] } => {
  const files = workspace([], state);
  writeFileSync(files.selection, JSON.stringify(selection));
  run(["record", files.state, files.selection, ...posted]);
  return JSON.parse(readFileSync(files.state, "utf8"));
};

describe.skipIf(!hasJq)("so-me-posts.sh", () => {
  describe("select", () => {
    it("selects the issues that were created after the cutoff", () => {
      const { posts } = select([
        issue({ uuid: "1", created_at: "2026-10-20T10:00:00.000Z" }),
        issue({ uuid: "2", created_at: "2026-09-20T10:00:00.000Z" })
      ]);
      expect(posts.map((post) => post.uuid)).toEqual(["1"]);
    });

    it("matches the label case insensitively", () => {
      const { posts } = select([
        issue({ uuid: "1", labels: ["good first issue"] }),
        issue({ uuid: "2", labels: ["Good First Issue"] }),
        issue({ uuid: "3", labels: ["Good first issue"] })
      ]);
      expect(posts.map((post) => post.uuid)).toEqual(["1", "2", "3"]);
    });

    it("ignores the issues without the label", () => {
      const { posts } = select([
        issue({ uuid: "1", labels: ["help wanted"] }),
        issue({ uuid: "2", labels: [] }),
        issue({ uuid: "3", labels: ["good first issue"] })
      ]);
      expect(posts.map((post) => post.uuid)).toEqual(["3"]);
    });

    it("skips the issues that were posted already", () => {
      const { posts } = select([issue({ uuid: "1" }), issue({ uuid: "2" })], {
        posted: ["1"],
        reserved: []
      });
      expect(posts.map((post) => post.uuid)).toEqual(["2"]);
    });

    it("skips the issues that are reserved", () => {
      const { posts } = select([issue({ uuid: "1" }), issue({ uuid: "2" })], {
        posted: [],
        reserved: ["1"]
      });
      expect(posts.map((post) => post.uuid)).toEqual(["2"]);
    });

    it("reads a state file that only has a list of uuids", () => {
      const { posts } = select([issue({ uuid: "1" }), issue({ uuid: "2" })], ["1"]);
      expect(posts.map((post) => post.uuid)).toEqual(["2"]);
    });

    it("reports a state file that is not valid JSON", () => {
      const { posts, stderr } = select([issue({ uuid: "1" })], "not json");
      expect(posts.map((post) => post.uuid)).toEqual(["1"]);
      expect(stderr).toContain("not valid JSON");
    });

    it("posts the maximum number of issues", () => {
      const { posts, count } = select(
        [issue({ uuid: "1" }), issue({ uuid: "2" }), issue({ uuid: "3" })],
        undefined,
        { MAX_POSTS: "2" }
      );
      expect(posts).toHaveLength(2);
      expect(count).toBe("2");
    });

    it("sorts the issues by their creation date, the oldest first", () => {
      const { posts } = select([
        issue({ uuid: "1", created_at: "2026-10-20T10:00:00.000Z" }),
        issue({ uuid: "2", created_at: "2026-10-05T10:00:00.000Z" }),
        issue({ uuid: "3", created_at: "2026-10-10T10:00:00.000Z" })
      ]);
      expect(posts.map((post) => post.uuid)).toEqual(["2", "3", "1"]);
    });

    it("keeps the text within the maximum length", () => {
      const { posts } = select([issue({ uuid: "1", title: "A".repeat(400) })], undefined, {
        MAX_TEXT_LENGTH: "220"
      });
      expect(posts[0].text.length).toBeLessThanOrEqual(220);
    });

    it("keeps the url and the hashtags when the title is shortened", () => {
      const { posts } = select([issue({ uuid: "1", title: "A".repeat(400) })], undefined, {
        MAX_TEXT_LENGTH: "220"
      });
      expect(posts[0].text).toContain("https://github.com/example/project/issues/1");
      expect(posts[0].text).toContain("#goodfirstissue");
    });

    it("drops the project info when the text does not fit", () => {
      const { posts } = select(
        [
          issue({ uuid: "1", title: "A".repeat(400), project: { name: "Project", language: "Go" } })
        ],
        undefined,
        { MAX_TEXT_LENGTH: "190" }
      );
      expect(posts[0].text).not.toContain("(Go)");
      expect(posts[0].text).toContain("https://github.com/example/project/issues/1");
    });

    it("keeps a space between the title and the url", () => {
      const { posts } = select(
        [
          issue({ uuid: "1", title: "A".repeat(400), project: { name: "Project", language: "Go" } })
        ],
        undefined,
        { MAX_TEXT_LENGTH: "190" }
      );
      expect(posts[0].text).toContain(" https://github.com/example/project/issues/1");
    });

    it("does not post an issue that does not fit with the url and the hashtags", () => {
      const { posts } = select([issue({ uuid: "1" })], undefined, { MAX_TEXT_LENGTH: "100" });
      expect(posts).toEqual([]);
    });

    it("uses the project name and language", () => {
      const { posts } = select([
        issue({ uuid: "1", project: { name: "Project", language: "Go" } })
      ]);
      expect(posts[0].text).toContain("(Go) - Project");
    });

    it("ignores the issues with a uuid that is not a safe file name", () => {
      const { posts } = select([issue({ uuid: "../../etc/passwd" }), issue({ uuid: "42" })]);
      expect(posts.map((post) => post.uuid)).toEqual(["42"]);
    });

    it("ignores the issues that are closed", () => {
      const { posts } = select([
        issue({ uuid: "1", state: "closed" }),
        issue({ uuid: "2", state: "open" })
      ]);
      expect(posts.map((post) => post.uuid)).toEqual(["2"]);
    });

    it("ignores the issues without a url", () => {
      const { posts } = select([issue({ uuid: "1", html_url: "" }), issue({ uuid: "2" })]);
      expect(posts.map((post) => post.uuid)).toEqual(["2"]);
    });

    it("posts an issue without a title without a title", () => {
      const { posts } = select([issue({ uuid: "1", title: "" })]);
      expect(posts[0].text).toBe(
        "A new good first issue available for contribution: (TypeScript) - Project https://github.com/example/project/issues/1 #climate #sustainability #opensource #opensustain #goodfirstissue #goodfirstissues"
      );
    });
  });

  describe("reserve", () => {
    it("reserves the selected issues", () => {
      const { files } = select([issue({ uuid: "1" }), issue({ uuid: "2" })]);
      const state = reserve(files);
      expect(state.reserved).toEqual(["1", "2"]);
      expect(state.posted).toEqual([]);
    });
  });

  describe("record", () => {
    const selection = [{ uuid: "1" }, { uuid: "2" }, { uuid: "3" }];

    it("moves the posted issues to the posted list", () => {
      const state = record(selection, ["1", "3"], { posted: [], reserved: ["1", "2", "3"] });
      expect(state.posted).toEqual(["1", "3"]);
    });

    it("releases the reservation of an issue that failed", () => {
      const state = record(selection, ["1", "3"], { posted: [], reserved: ["1", "2", "3"] });
      expect(state.reserved).toEqual([]);
    });

    it("keeps the reservation of another run", () => {
      const state = record(selection, ["1"], { posted: [], reserved: ["1", "2", "3", "4"] });
      expect(state.reserved).toEqual(["4"]);
    });

    it("releases every reservation when no post succeeded", () => {
      const state = record(selection, [], { posted: [], reserved: ["1", "2", "3"] });
      expect(state.reserved).toEqual([]);
      expect(state.posted).toEqual([]);
    });
  });
});
