const { getRegistry, getInstalled, SKILLS_DIR } = require('../index')

async function list(args) {
  const [filter] = args

  const installed = getInstalled()
  const installedNames = new Set(installed.map(s => s.name))

  let registry
  try {
    registry = await getRegistry()
  } catch (err) {
    console.error(`error: failed to fetch registry — ${err.message}`)
    process.exit(1)
  }

  let items = registry
  if (filter) {
    const q = filter.toLowerCase()
    items = items.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q))
    )
  }

  const nameWidth = Math.max(...items.map(s => s.name.length), 8)

  console.log()
  console.log(`  open-skills registry (${registry.length} total)`)
  console.log(`  installed: ${installed.length} in ${SKILLS_DIR}`)
  console.log()

  if (items.length === 0) {
    console.log('  no skills match your filter')
    console.log()
    return
  }

  for (const s of items) {
    const mark = installedNames.has(s.name) ? '✓' : ' '
    const status = s.status === 'curated' ? '●' : s.status === 'experimental' ? '○' : '◦'
    console.log(
      `  ${mark} ${status} ${s.name.padEnd(nameWidth)}  ${s.desc}`
    )
  }
  console.log()
  console.log(`  ${items.length} skills shown`)
  console.log()
}

module.exports = list
