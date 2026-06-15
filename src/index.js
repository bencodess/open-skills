const path = require('path')
const fs = require('fs')

const RAW_BASE = 'https://raw.githubusercontent.com/bencodess/open-skills/main'
const REGISTRY_URL = `${RAW_BASE}/skills.json`

const SKILLS_DIR = path.resolve(process.cwd(), '.opencode/skills')

function skillsDir(name) {
  return path.join(SKILLS_DIR, name)
}

function skillPath(name) {
  return path.join(skillsDir(name), 'SKILL.md')
}

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.json()
}

async function fetchText(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.text()
}

async function getRegistry() {
  return fetchJSON(REGISTRY_URL)
}

function getInstalled() {
  try {
    const names = fs.readdirSync(SKILLS_DIR).filter(n => {
      const p = skillPath(n)
      return fs.existsSync(p) && fs.statSync(p).isFile()
    })
    return names.map(name => {
      const content = fs.readFileSync(skillPath(name), 'utf-8')
      const desc = content.match(/^description:\s*(.+)/m)?.[1]?.trim() || ''
      return { name, desc }
    })
  } catch {
    return []
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

module.exports = {
  RAW_BASE,
  REGISTRY_URL,
  SKILLS_DIR,
  skillsDir,
  skillPath,
  fetchJSON,
  fetchText,
  getRegistry,
  getInstalled,
  ensureDir,
}
