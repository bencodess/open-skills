const fs = require('fs')
const { skillPath } = require('../index')

function read(args) {
  if (args.length === 0) {
    console.error('usage: open-skill read <name>')
    process.exit(1)
  }

  const name = args[0]
  const filePath = skillPath(name)

  if (!fs.existsSync(filePath)) {
    console.error(`error: skill "${name}" is not installed`)
    console.error(`  run \`open-skill install ${name}\` first`)
    process.exit(1)
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  console.log()
  console.log(content)
}

module.exports = read
