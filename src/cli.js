const path = require('path')

const HELP = `
  open-skill — OpenCode skills registry CLI

  usage:
    open-skill list [filter]    List all skills in the registry
    open-skill install <name>   Install a skill to .opencode/skills/<name>/
    open-skill read <name>      Read an installed skill's SKILL.md
    open-skill sync             Sync registry index
    open-skill update           Update all installed skills

  examples:
    open-skill list
    open-skill list design
    open-skill install git-release
    open-skill read git-release
    open-skill sync
    open-skill update
`

async function run(args) {
  const [cmd, ...rest] = args

  if (!cmd || cmd === '--help' || cmd === '-h') {
    console.log(HELP.trimEnd())
    return
  }

  const commands = {
    list:    () => require('./commands/list')(rest),
    install: () => require('./commands/install')(rest),
    read:    () => require('./commands/read')(rest),
    sync:    () => require('./commands/sync')(rest),
    update:  () => require('./commands/update')(rest),
  }

  const handler = commands[cmd]
  if (!handler) {
    console.error(`error: unknown command "${cmd}"`)
    console.error(`  run \`open-skill --help\` for usage`)
    process.exit(1)
  }

  try {
    await handler()
  } catch (err) {
    console.error(`error: ${err.message}`)
    process.exit(1)
  }
}

module.exports = { run }
