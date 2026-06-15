import { cn } from "@/lib/utils"
import type { Skill } from "@/data/skills"

const statusConfig = {
  curated: { dot: "bg-orange-500", label: "curated" },
  experimental: { dot: "bg-indigo-500", label: "experimental" },
  community: { dot: "bg-gray-500", label: "community" },
} as const

interface SkillCardProps {
  skill: Skill
  onSelect: (skill: Skill) => void
}

export function SkillCard({ skill, onSelect }: SkillCardProps) {
  const cfg = statusConfig[skill.status]

  return (
    <div
      className="group rounded-none border border-border bg-card transition-all duration-200 hover:border-primary cursor-pointer flex flex-col"
      onClick={() => onSelect(skill)}
      role="listitem"
    >
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <span className="font-mono text-xs font-semibold tracking-tight text-primary">
            {skill.name}
          </span>
          <span className={cn("w-2 h-2 rounded-full shrink-0 mt-1", cfg.dot)} />
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground mb-3 flex-1 line-clamp-3">
          {skill.desc}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {skill.tags.map(t => (
            <span key={t} className="inline-flex items-center border border-border bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-mono">
              {t}
            </span>
          ))}
        </div>

        <div className="h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
      </div>
    </div>
  )
}
