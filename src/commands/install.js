const path = require('path')
const fs = require('fs')
const { getRegistry, skillPath, skillsDir, ensureDir, fetchText, RAW_BASE } = require('../index')

async function install(args) {
  if (args.length === 0) {
    console.error('usage: open-skill install <name>')
    process.exit(1)
  }

  const name = args[0]

  let registry
  try {
    registry = await getRegistry()
  } catch (err) {
    console.error(`error: failed to fetch registry — ${err.message}`)
    process.exit(1)
  }

  const skill = registry.find(s => s.name === name)
  if (!skill) {
    console.error(`error: skill "${name}" not found in registry`)
    console.error(`  run \`open-skill list\` to see available skills`)
    process.exit(1)
  }

  const rawUrl = `${RAW_BASE}/${skill.path}`
  console.log(`  installing "${name}"...`)

  let content
  try {
    content = await fetchText(rawUrl)
  } catch (err) {
    console.error(`error: failed to download — ${err.message}`)
    process.exit(1)
  }

  const dir = skillsDir(name)
  const outPath = skillPath(name)
  ensureDir(dir)

  // add install note to SKILL.md
  const header = `<!-- installed via open-skills -->\n`
  fs.writeFileSync(outPath, header + content, 'utf-8')

  console.log(`  ✓ installed to ${path.relative(process.cwd(), outPath)}`)
  console.log()
}

module.exports = install
