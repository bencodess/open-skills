import { useState, useMemo } from "react"
import { SearchBar } from "@/components/SearchBar"
import { StatsBar } from "@/components/StatsBar"
import { SkillGrid } from "@/components/SkillGrid"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useSkills } from "@/hooks/useSkills"
import type { Skill } from "@/data/skills"

const REPO = 'https://github.com/bencodess/open-skills'
const RAW = 'https://raw.githubusercontent.com/bencodess/open-skills/main'
const APP_VERSION = '0.1.0'

export default function App() {
  const { skills, loading, error, refresh, exportSkills } = useSkills()

  const [query, setQuery] = useState("")
  const [activeTag, setActiveTag] = useState("all")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const allTags = useMemo(
    () => [...new Set(skills.flatMap(s => s.tags))].sort(),
    [skills]
  )

  const queryTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)

  const filtered = useMemo(
    () => skills.filter(skill => {
      if (activeTag !== "all" && !skill.tags.includes(activeTag)) return false
      if (queryTerms.length > 0) {
        const searchable = `${skill.name} ${skill.desc} ${skill.tags.join(" ")} ${skill.status}`.toLowerCase()
        return queryTerms.every(t => searchable.includes(t))
      }
      return true
    }),
    [skills, activeTag, queryTerms]
  )

  const counts = useMemo(() => ({
    total: skills.length,
    curated: skills.filter(s => s.status === "curated").length,
    experimental: skills.filter(s => s.status === "experimental").length,
    community: skills.filter(s => s.status === "community").length,
  }), [skills])

  const handleExport = () => {
    const json = exportSkills()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "opencode-skills.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col scanlines">
      {/* HEADER */}
      <header
        className="fixed top-0 left-0 right-0 h-14 bg-[#14141a] border-b border-border z-50 shadow-lg glow-orange"
        role="banner"
      >
        <div className="h-[3px] bg-[repeating-linear-gradient(90deg,#3a3a4a_0px,#3a3a4a_4px,transparent_4px,transparent_8px)]" />
        <div className="flex items-center justify-between h-full px-4 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-primary" />
              <span className="w-3 h-3 bg-primary/60" />
              <span className="w-3 h-3 bg-primary/30" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider uppercase text-foreground">
                <span className="text-primary">//</span> Skill Index
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground">opencode agent skills registry</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-[10px] font-mono text-muted-foreground">v{APP_VERSION}</span>
            <span className="text-xs font-mono text-muted-foreground">
              {skills.length} skills
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a4a]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a4a]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a4a]" />
          </div>
        </div>
      </header>

      {/* PIPE DUCT */}
      <div className="fixed top-14 left-0 right-0 h-3.5 z-40 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1 left-0 right-0 h-2 bg-gradient-to-b from-[#4a4a5e] to-[#3a3a4a] rounded-sm shadow-sm" />
        {[15, 35, 55, 75].map(p => (
          <span key={p} className="absolute w-3 h-3 bg-[#3a3a4a] rounded-full top-[1px]" style={{ left: `${p}%` }} />
        ))}
      </div>

      {/* SAFETY BAR */}
      <div className="fixed top-[68px] h-1 z-30 pointer-events-none" style={{ left: 0, right: 0 }} aria-hidden="true">
        <div className="safety-bar" />
      </div>

      {/* VERTICAL PIPES */}
      <div className="fixed top-0 bottom-0 w-[5px] z-30 pointer-events-none opacity-30 hidden md:block left-[60px] bg-gradient-to-r from-[#3a3a4a] via-[#4a4a5e] to-[#3a3a4a]" aria-hidden="true" />
      <div className="fixed top-0 bottom-0 w-[5px] z-30 pointer-events-none opacity-30 hidden md:block right-[60px] bg-gradient-to-r from-[#3a3a4a] via-[#4a4a5e] to-[#3a3a4a]" aria-hidden="true" />

      {/* MAIN */}
      <main className="relative z-10 pt-24 pb-8 px-4 md:px-12 lg:px-16 max-w-7xl mx-auto w-full flex-1">
        {/* PROMPT LINE */}
        <div className="mb-6 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="text-primary">~/$</span>
          <span>cat skills.json | open-skill index</span>
          <span className="terminal-cursor" />
        </div>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          allTags={allTags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <StatsBar {...counts} loading={loading} />

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="font-mono text-xs">
              sync
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} className="font-mono text-xs">
              export
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="font-mono text-xs gap-1"
              onClick={() => window.open(`${REPO}/issues/new`, '_blank')}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              submit skill
            </Button>
          </div>
        </div>

        {error && !loading && (
          <div className="mb-4 p-3 border border-destructive/30 bg-destructive/5 text-destructive text-xs font-mono">
            sync failed: {error}
            <button className="ml-2 underline cursor-pointer" onClick={refresh}>retry</button>
          </div>
        )}

        <SkillGrid
          skills={filtered}
          onSelect={setSelectedSkill}
          isEmpty={!loading && filtered.length === 0}
        />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card mt-12 py-6 px-4 md:px-12 brick-wall" role="contentinfo">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-primary" />
            <span className="text-xs font-mono text-muted-foreground">
              <span className="text-primary">opencode</span> skill index v{APP_VERSION}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-primary transition-colors duration-200"
            >
              {REPO.replace('https://', '')}
            </a>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3a3a4a]" />
            <span>conforming basement // build 004</span>
          </div>
        </div>
      </footer>

      {/* DETAIL DIALOG */}
      <Dialog open={!!selectedSkill} onOpenChange={(open) => { if (!open) setSelectedSkill(null) }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <DialogTitle className="font-mono text-primary">{selectedSkill?.name}</DialogTitle>
              <Badge variant={selectedSkill?.status === "curated" ? "primary" : selectedSkill?.status === "experimental" ? "secondary" : "default"}>
                {selectedSkill?.status}
              </Badge>
            </div>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">{selectedSkill?.desc}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSkill?.tags.map(t => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>

          {/* Terminal install block */}
          {selectedSkill && (
            <div className="border border-border bg-[#0a0a0e] p-3 mb-3 space-y-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-mono text-primary">
                <span>$</span>
                <span className="terminal-cursor">install {selectedSkill.name}</span>
              </div>
              <div className="bg-background border border-border p-2.5 font-mono text-[11px] text-muted-foreground break-all select-all">
                <span className="text-primary">curl</span> -O {RAW}/{selectedSkill.path}
              </div>
              <div className="bg-background border border-border p-2.5 font-mono text-[11px] text-muted-foreground break-all select-all">
                <span className="text-primary">open-skill</span> install {selectedSkill.name}
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">
                or browse:{' '}
                <a
                  href={`${REPO}/blob/main/${selectedSkill.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {REPO.replace('https://', '')}/tree/main/{selectedSkill.path}
                </a>
              </p>
            </div>
          )}

          <div className="text-xs font-mono text-muted-foreground space-y-0.5">
            <p><span className="text-primary">license</span> {selectedSkill?.license}</p>
            <p><span className="text-primary">path</span> {selectedSkill?.path}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
