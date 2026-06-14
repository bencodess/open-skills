const { getRegistry } = require('../index')

async function sync() {
  try {
    const registry = await getRegistry()
    console.log(`  synced: ${registry.length} skills in registry`)
  } catch (err) {
    console.error(`error: sync failed — ${err.message}`)
    process.exit(1)
  }
}

module.exports = sync
