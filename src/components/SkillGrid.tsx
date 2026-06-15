import type { Skill } from "@/data/skills"
import { SkillCard } from "./SkillCard"

interface SkillGridProps {
  skills: Skill[]
  onSelect: (skill: Skill) => void
  isEmpty: boolean
}

export function SkillGrid({ skills, onSelect, isEmpty }: SkillGridProps) {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="w-16 h-16 mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium mb-1 text-muted-foreground">no skills found</p>
        <p className="text-sm text-muted-foreground/60">try adjusting your search or filter</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
      {skills.map(skill => (
        <SkillCard key={skill.id} skill={skill} onSelect={onSelect} />
      ))}
    </div>
  )
}
