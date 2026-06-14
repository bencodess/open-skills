---
name: git-release
description: Create consistent releases and changelogs. Draft release notes from merged PRs, propose version bumps, and provide copy-pasteable gh release create commands.
---

# git-release

Create consistent releases and changelogs. Draft release notes from merged PRs, propose version bumps, and provide copy-pasteable gh release create commands.

## Prerequisites

Git, GitHub CLI (`gh`)

---

## How to Use

When user wants to create a release:
1. Run `git log --oneline --no-decorate` to see recent commits
2. Categorize by type (feat, fix, chore)
3. Draft release notes
4. Propose version bump via semver
5. Output `gh release create` command

---

## License

MIT
