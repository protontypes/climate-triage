# Working on ClimateTriage

ClimateTriage is a statically exported Next.js site (`output: "export"`, served from GitHub Pages).
Project and issue data comes from the ecosyste.ms OST API at build time (`pnpm prebuild`), and an
hourly workflow rebuilds and deploys `main`. The contributor policy, including AI use, is in
`CONTRIBUTING.md`.

## Before writing code

- Features, new data sources, metrics and changes over roughly 100 lines need an issue where a
  maintainer agreed to the approach. If there is none, propose the approach on the issue and stop
  there. Small fixes can go straight to a PR.
- Check open PRs and recent commits on `main` for the same work.
- If your solution measures or changes something other than what the issue describes, raise it on
  the issue first.
- Don't add content that goes stale on its own, such as roadmaps, status lists or hand-maintained
  project lists.

## Scope

- One concern per PR. No drive-by reformatting, refactors or dependency bumps. Mention unrelated
  findings to the user instead of fixing them.
- Never ship placeholder or invented data. `main` is live within the hour.
- Match the surrounding code. Biome handles formatting.
- Dependency, tooling and CI changes are maintainer-led. Suggest an issue instead.
- If the change grows past a few hundred lines, stop and ask whether to split it.

## Constraints that are easy to miss

- Static export means no server runtime: no route handlers, middleware/proxy, server actions,
  ISR/revalidate, or request-time cookies and headers. Anything dynamic happens in the build or in
  the browser. Check `node_modules/next/dist/docs/` for whether a feature supports static export.
- Use `pnpm prebuild:sample` in the dev loop. It builds from the committed fixture. Run the live
  `pnpm prebuild` only when you need live data, and never in a loop or a test.
- If you change the shape of the generated data, update its type declaration and the sample fixture
  in the same PR, so typecheck and the CI build keep working without the API.
- If the API returns wrong or lagging data, suggest an upstream issue at ecosyste-ms/ost with a
  repro, rather than quietly working around it here.
- In GitHub workflows, pin actions to a full commit SHA with a version comment, keep
  `permissions: contents: read` unless more is needed, and use `persist-credentials: false` on
  checkout. Scheduled jobs such as the social posting bots can stay green while doing nothing, so
  check what they output, not only the exit code.

## Verifying a change

```
pnpm lint          # pnpm lint:fix for what Biome can fix
pnpm typecheck
pnpm test
pnpm prebuild:sample && pnpm build   # when touching pages, routing, metadata or the data pipeline
```

- Logic in the data pipeline and helpers gets Vitest tests next to the existing ones. Where
  practical, bug fixes get a test that fails without the fix.
- For UI changes, run the site and check the affected pages, including keyboard use and small
  viewports.

## Pull requests

- Titles take a type prefix and the imperative: `fix: debounce repository search`. Maintainers
  squash on merge, so there's no need to squash. Rebase onto `main` to resolve conflicts.
- Fill in the PR template. Say how the change itself was checked: frontend changes need a browser
  check and screenshots. Don't list lint or tests, which CI shows.
- The human opening the PR has read every line and replies to review comments themselves.

## Writing

A maintainer reads everything you write, and their time is the scarce resource. This covers PR
descriptions, issue comments, review replies, commit messages and code comments.

- Lead with the point. The first sentence says what changed, or what you're asking.
- Say each thing once. Don't restate the diff, the issue or the template headings, and don't end
  with a summary.
- Report findings and decisions, not the process ("First I explored...", "After investigating...").
- A typical PR description is a few sentences. Go longer only where the reasoning isn't obvious,
  and explain the reasoning, not the code.
- Use plain prose for short text, without headings or bold. No emoji or flattery, and don't call
  your work robust or comprehensive.
- Say what you didn't verify, in one line.
- Code comments explain why, not what. A comment describing the change ("Added X", "Fixed Y")
  belongs in the commit message.

## Triaging PRs (for maintainers and their agents)

When asked to review or triage a PR, check these in order:

1. Features and large changes have an issue with an agreed approach. The PR template is filled in.
2. The diff does what the PR or issue says, and nothing unrelated.
3. It isn't superseded by `main` or another open PR.
4. CI is green. For changes to the data pipeline or workflows, check the behaviour locally, since
   CI only proves it builds. Frontend changes include screenshots.
5. No placeholder data, no new runtime API calls, nothing that breaks static export.
6. Any conflicts with `main`, and who should resolve them.

Report in a few lines and recommend one of: merge, request changes (name the changes), or close
(give the reason and where to continue). Leave the decision and any posting to the maintainer.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
