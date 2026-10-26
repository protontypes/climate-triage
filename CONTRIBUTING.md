# Contributing Guidelines

Thanks for helping out. **No contribution is too small.**

## Step 1 : Pick something to work on

- Small fixes and improvements can go straight to a PR. Describe the problem in the PR.
- Features, new data sources, metrics and anything over roughly 100 lines need an issue first. Propose your approach there and wait for a maintainer to agree before building it.
- Comment on the issue when you start, and check open PRs, so nobody does the same work twice.

## Step 2 : Set up

Fork the repository, then:

```
git clone https://github.com/<your-username>/climate-triage
cd climate-triage
git remote add upstream https://github.com/protontypes/climate-triage
pnpm install            # also installs the pre-commit hook
pnpm prebuild:sample    # builds the data from a committed sample, no API calls
pnpm dev
```

The Node version is in `.nvmrc`. `pnpm prebuild` fetches live data from ecosyste.ms instead. You rarely need it.

## Step 3 : Make your change

- Branch from an up-to-date `main`: `git fetch upstream && git switch -c my-fix upstream/main`.
- Keep the PR to one concern. Leave unrelated reformatting, refactors and dependency bumps for another PR.
- Every commit runs [Biome](https://biomejs.dev) on the staged files. If it blocks the commit, fix what it reports and commit again. If the hook didn't install, run `pnpm exec husky`.
- Before pushing, run what CI runs:

```
pnpm lint        # or `pnpm lint:fix` to auto-fix what Biome can
pnpm typecheck
pnpm test
```

## Step 4 : Open a pull request

- Use a title like `fix: debounce repository search` (or `feat:`, `docs:`, `ci:`).
- Fill in the PR template. A few sentences on what was wrong, what changed and what you ran is usually enough.
- No need to squash commits. We squash when merging. If `main` moves and conflicts, rebase onto it.

## Writing PRs, issues and comments ✍️

Reviewers read every word, so keep it short.

- Lead with the point. The first sentence says what changed, or what you're asking.
- Say things once. Don't repeat the diff, the issue or the template headings back.
- Describe what you found and decided, not every step you took to get there.
- Add more detail only where the reasoning isn't obvious from the code.

## Using AI tools 🤖

AI coding tools are welcome. The bar for a PR is the same however it was written.

- **You are the author.** You have read every line of the diff, run the checks, and can answer review comments yourself. Please don't paste AI output into replies unedited.
- **Edit what it writes.** AI tools make long descriptions cheap to write but not to read. Trim them to the points above before posting.
- **Point your agent at [AGENTS.md](AGENTS.md).** It holds this project's working rules for agents. Claude Code, Codex, Cursor and others read it automatically.

PRs that skip these steps may be closed with a short reason and a pointer to where to continue. That isn't a judgement on you, and you're welcome to pick the work up again.

## Need more help? 🤔

Ask on the issue, or see GitHub's guides to [forking a repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and [creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).
