# Contributing

## Branches

Create short-lived branches from `main` using one of these prefixes:

- `feat/` for customer-facing behavior
- `fix/` for defect corrections
- `test/` for test-only changes
- `chore/` for tooling and repository maintenance

Keep each branch focused on one reviewable capability. Rebase or update it from
`main` before opening a pull request, and delete it after merging.

## Commits

Use an imperative Conventional Commit subject, for example:

```text
feat: expose restaurant menu endpoint
test: cover GST-inclusive rounding
```

Commit working checkpoints that explain how the solution evolved. Do not split
changes into artificial one-file commits.

## Quality checks

Before requesting review, run:

```sh
npm run check
npm test
npm run build
```
