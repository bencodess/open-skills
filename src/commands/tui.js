const path = require('path')
const fs = require('fs')
const { getRegistry, getInstalled, RAW_BASE, skillPath, skillsDir, ensureDir, fetchText } = require('../index')

async function tui(args) {
  const { createCliRenderer, Box, Text, Input, Select, t, bold, fg } =
    await import('@opentui/core')

  let registry
  try {
    registry = await getRegistry()
  } catch (err) {
    console.error(`error: failed to fetch registry — ${err.message}`)
    process.exit(1)
  }

  const installed = getInstalled()
  const installedNames = new Set(installed.map(s => s.name))
  let installedCount = installed.length

  let renderer
  try {
    renderer = await createCliRenderer({ exitOnCtrlC: true })
  } catch (err) {
    console.error()
    console.error('  error: OpenTUI native renderer is not available on this runtime.')
    console.error()
    console.error('  The TUI requires Bun or Node.js 26.3+ with --experimental-ffi.')
    console.error()
    console.error('  Install Bun: curl -fsSL https://bun.sh/install | bash')
    console.error('  Then run:     bun open-skill')
    console.error()
    console.error('  Or use the classic CLI: open-skill list / install / read / sync / update')
    console.error()
    process.exit(1)
  }

  const C = {
    orange: '#f97316',
    orangeDark: '#ea580c',
    orangeLight: '#fdba74',
    bg: '#1c1917',
    panel: '#292524',
    border: '#44403c',
    text: '#fafaf9',
    muted: '#a8a29e',
    green: '#22c55e',
    yellow: '#eab308',
  }

  let currentFilter = ''
  let detailSkill = null
  let awaitingKey = false
  let searchFocused = true

  function filteredSkills() {
    if (!currentFilter) return registry
    const q = currentFilter.toLowerCase()
    return registry.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.tags?.some(t => t.includes(q))
    )
  }

  function statusSymbol(s) {
    return s === 'curated' ? '●' : s === 'experimental' ? '○' : '◦'
  }

  function statusCol(s) {
    return s === 'curated' ? C.orange : s === 'experimental' ? C.yellow : C.muted
  }

  function fmtOpts(skills) {
    return skills.map(s => {
      const mark = installedNames.has(s.name) ? '✓ ' : '  '
      return { name: `${mark}${statusSymbol(s.status)} ${s.name}`, description: s.desc, value: s }
    })
  }

  function refreshInstalled() {
    const updated = getInstalled()
    installed.length = 0
    updated.forEach(s => installed.push(s))
    installedNames.clear()
    updated.forEach(s => installedNames.add(s.name))
    installedCount = installed.length
  }

  function focusSearch() {
    searchFocused = true
    searchInput?.focus()
  }

  function focusList() {
    searchFocused = false
    skillSelect?.focus()
  }

  let searchInput
  let skillSelect

  function buildList() {
    searchInput = Input({
      width: '100%',
      placeholder: '  🔍 filter skills...',
      backgroundColor: C.bg,
      focusedBackgroundColor: C.panel,
      textColor: C.text,
      cursorColor: C.orange,
    })

    skillSelect = Select({
      width: '100%',
      height: '100%',
      options: fmtOpts(filteredSkills()),
      backgroundColor: C.bg,
      textColor: C.text,
      selectedBackgroundColor: C.orangeDark,
      selectedTextColor: '#fff',
      descriptionColor: C.muted,
      selectedDescriptionColor: C.muted,
      showScrollIndicator: true,
      showDescription: true,
      wrapSelection: true,
    })

    searchInput.on('input', value => {
      currentFilter = value
      skillSelect.options = fmtOpts(filteredSkills())
    })

    searchInput.on('enter', () => focusList())

    // Enter handled globally below to avoid focus/event conflicts

    const headerBar = Box(
      {
        width: '100%',
        height: 3,
        backgroundColor: C.orangeDark,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 2,
        paddingRight: 2,
        gap: 2,
      },
      Text({ content: t`${bold('⚙ open-skills')}`, fg: '#fff' }),
      Text({ content: `${registry.length} skills`, fg: C.orangeLight }),
      Text({ content: `✓ ${installedCount} installed`, fg: C.green }),
    )

    const searchRow = Box(
      {
        width: '100%',
        height: 3,
        backgroundColor: C.bg,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 1,
        paddingRight: 1,
        borderStyle: 'single',
        borderColor: C.border,
      },
      searchInput,
    )

    const listArea = Box(
      { width: '100%', flexGrow: 1, backgroundColor: C.bg },
      skillSelect,
    )

    const footerBar = Box(
      {
        width: '100%',
        height: 1,
        backgroundColor: C.panel,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 2,
        paddingRight: 2,
      },
      Text({ content: '  [Tab] switch focus  •  ↑↓ nav  •  Enter detail  •  q quit', fg: C.muted }),
    )

    return Box(
      { width: '100%', height: '100%', flexDirection: 'column', backgroundColor: C.bg },
      headerBar, searchRow, listArea, footerBar,
    )
  }

  function buildDetail() {
    const skill = detailSkill
    if (!skill) return buildList()
    const isInstalled = installedNames.has(skill.name)

    return Box(
      { width: '100%', height: '100%', flexDirection: 'column', backgroundColor: C.bg, padding: 2, gap: 1 },
      Text({ content: t`${bold(skill.name)}`, fg: C.text }),
      Text({ content: `[${skill.status}]`, fg: statusCol(skill.status) }),
      Box({ height: 1 }),
      Text({ content: skill.desc, fg: C.muted }),
      Box({ height: 1 }),
      Text({ content: `tags: ${skill.tags?.join(', ') || 'none'}`, fg: C.muted }),
      Text({ content: `license: ${skill.license || 'unknown'}`, fg: C.muted }),
      Box({ height: 1 }),
      Text({ content: isInstalled ? t`${bold('✓ installed')}` : t`press ${bold(fg(C.orange)('i'))} to install`, fg: isInstalled ? C.green : C.text }),
      Box({ flexGrow: 1 }),
      Text({ content: '  press b to go back  •  q quit', fg: C.muted }),
    )
  }

  function showList() {
    detailSkill = null
    renderer.root.removeAll()
    renderer.root.add(buildList())
    process.nextTick(() => searchFocused ? searchInput?.focus() : skillSelect?.focus())
  }

  function showDetail() {
    renderer.root.removeAll()
    renderer.root.add(buildDetail())
  }

  async function doInstall(skill) {
    awaitingKey = true
    const msg = Box(
      { width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, gap: 1 },
      Text({ content: 'installing...', fg: C.orange }),
    )
    renderer.root.removeAll()
    renderer.root.add(msg)

    try {
      const rawUrl = `${RAW_BASE}/${skill.path}`
      const content = await fetchText(rawUrl)
      const dir = skillsDir(skill.name)
      const outPath = skillPath(skill.name)
      ensureDir(dir)
      fs.writeFileSync(outPath, `<!-- installed via open-skills -->\n${content}`, 'utf-8')
      refreshInstalled()

      const success = Box(
        { width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, gap: 1 },
        Text({ content: t`${bold('✓ installed!')}`, fg: C.green }),
        Text({ content: path.relative(process.cwd(), outPath), fg: C.muted }),
        Text({ content: 'press any key to continue', fg: C.muted }),
      )
      renderer.root.removeAll()
      renderer.root.add(success)
    } catch (err) {
      const errBox = Box(
        { width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, gap: 1 },
        Text({ content: `error: ${err.message}`, fg: '#ef4444' }),
        Text({ content: 'press any key to continue', fg: C.muted }),
      )
      renderer.root.removeAll()
      renderer.root.add(errBox)
    }
  }

  renderer.keyInput.on('keypress', key => {
    if (awaitingKey) {
      awaitingKey = false
      showList()
      return
    }

    if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
      renderer.destroy()
      return
    }

    if (detailSkill) {
      if (key.name === 'b' || key.name === 'escape') {
        showList()
      } else if (key.name === 'i' && !installedNames.has(detailSkill.name)) {
        doInstall(detailSkill)
      }
      return
    }

    if (key.name === 'tab') {
      if (searchFocused) {
        focusList()
      } else {
        focusSearch()
      }
      return
    }

    if (key.name === 'return') {
      if (!searchFocused && skillSelect) {
        const opt = skillSelect.getSelectedOption()
        if (opt && opt.value) {
          detailSkill = opt.value
          showDetail()
        }
      }
      return
    }

    if (key.name === '/') {
      focusSearch()
    } else if (key.name === 'escape') {
      if (searchFocused) {
        searchInput.value = ''
        currentFilter = ''
        skillSelect.options = fmtOpts(registry)
        focusList()
      }
    }
  })

  renderer.root.add(buildList())
  process.nextTick(() => focusSearch())
}

module.exports = tui
