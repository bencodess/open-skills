const path = require('path')
const fs = require('fs')
const { getRegistry, getInstalled, skillPath, skillsDir, ensureDir, fetchText, RAW_BASE } = require('../index')

async function update() {
  const installed = getInstalled()
  if (installed.length === 0) {
    console.log('  no skills installed')
    return
  }

  let registry
  try {
    registry = await getRegistry()
  } catch (err) {
    console.error(`error: failed to fetch registry — ${err.message}`)
    process.exit(1)
  }

  const regMap = new Map(registry.map(s => [s.name, s]))
  let updated = 0
  let removed = []

  for (const inst of installed) {
    const skill = regMap.get(inst.name)
    if (!skill) {
      removed.push(inst.name)
      fs.rmSync(skillsDir(inst.name), { recursive: true, force: true })
      console.log(`  ✗ removed "${inst.name}" (no longer in registry)`)
      continue
    }
    const rawUrl = `${RAW_BASE}/${skill.path}`
    try {
      const content = await fetchText(rawUrl)
      const header = `<!-- installed via open-skills -->\n`
      ensureDir(skillsDir(inst.name))
      fs.writeFileSync(skillPath(inst.name), header + content, 'utf-8')
      updated++
      console.log(`  ✓ updated "${inst.name}"`)
    } catch {
      console.log(`  - skipped "${inst.name}" (download failed)`)
    }
  }

  console.log()
  console.log(`  ${updated} updated${removed.length > 0 ? `, ${removed.length} removed` : ''}`)
  console.log()
}

module.exports = update
