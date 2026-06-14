<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/%2F%2F%20open--skills-0c0c10?style=for-the-badge&logo=github&logoColor=f97316&labelColor=0c0c10">
    <img alt="open-skills" src="https://img.shields.io/badge/%2F%2F%20open--skills-ffffff?style=for-the-badge&logo=github&logoColor=f97316&labelColor=ffffff">
  </picture>
</p>

<p align="center">
  <b>A community-driven registry of reusable agent skills</b><br>
  for <a href="https://opencode.ai">OpenCode</a> and compatible agent runtimes.
</p>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/quick%20start-f97316?style=flat-square" alt="Quick Start"></a>
  <a href="./skills.json"><img src="https://img.shields.io/badge/skills.json-2a2a3a?style=flat-square" alt="skills.json"></a>
  <a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/contributing-2a2a3a?style=flat-square" alt="Contributing"></a>
  <a href="https://github.com/bencodess/open-skills/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-2a2a3a?style=flat-square" alt="License"></a>
</p>

---

<br>

**open-skills** is the public registry powering the OpenCode Skill Index. Anyone can submit skills via pull request — reviewed, merged, and immediately available in the index.

<br>

## Quick Start

```bash
# browse the catalog
npx opencode-skills          # web UI

# add a skill to your agent
# (coming soon: opencode skill add <name>)
```

The registry is a plain JSON file. To use a skill, copy its `SKILL.md` to your agent's skills directory:

```bash
# install a skill manually
curl -O https://raw.githubusercontent.com/bencodess/open-skills/main/skills.json
```

---

## Skills

| Status | Count | Description |
|--------|-------|-------------|
| curated | 8 | Reviewed and maintained by the project team |
| experimental | 12 | Functional but may change |
| community | 4 | Community-submitted, best-effort maintenance |

Browse the full list in [`skills.json`](./skills.json) or use the [web index](https://bencodess.github.io/open-skills).

### Categories

Skills are tagged for discovery:

| Tag | Skills |
|-----|--------|
| `design` | ui-ux-pro-max |
| `testing` | webapp-testing, test |
| `git` | git-release, commit |
| `devops` | ci-cd, deploy, docker, monitoring |
| `security` | security-audit |
| `api` | api-design |
| `database` | database |
| `writing` | deep-research, docs |
| `a11y` | accessibility |
| `performance` | performance |
| `architecture` | architecture |
| `debugging` | debug |
| `refactoring` | refactor |

---

## Contributing

We welcome contributions. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full guide.

**Quick summary:**

1. Fork this repo
2. Edit `skills.json` with your skill entry
3. Open a pull request
4. CI validates the JSON automatically

All skills are MIT licensed.

---

<p align="center">
  <sub>built with 🔧 in the basement · conforming to opencode skill spec</sub>
</p>
