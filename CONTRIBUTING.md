# OpenCode Skills Registry

Community-maintained registry of reusable agent skills for [OpenCode](https://opencode.ai).

## Adding a Skill

1. Fork this repo
2. Add your skill entry to `skills.json`
3. Open a Pull Request

### Skill Entry Format

```json
{
  "name": "my-skill",
  "desc": "Short description of what the skill does.",
  "tags": ["tag1", "tag2"],
  "status": "community",
  "license": "MIT",
  "path": ".opencode/skills/my-skill/SKILL.md"
}
```

**Fields:**
- `name` — kebab-case unique identifier
- `desc` — one-line description
- `tags` — 1–4 lowercase tags for filtering
- `status` — `curated`, `experimental`, or `community`
- `license` — SPDX identifier
- `path` — install path for the SKILL.md file

### Status Guidelines

| Status | Meaning |
|--------|---------|
| `curated` | Reviewed and maintained by OpenCode team |
| `experimental` | Functional but may change |
| `community` | Submitted by community, best-effort maintenance |

## Validation

PRs are automatically validated via GitHub Actions:
- Valid JSON
- Required fields present
- No duplicate names

## License

Registry content is MIT licensed.
