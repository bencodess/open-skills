import { useState, useCallback } from 'react'
import type { Skill } from '@/data/skills'
import { SKILLS_DATA } from '@/data/skills'

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>(SKILLS_DATA)
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setSkills([...SKILLS_DATA])
  }, [])

  const exportSkills = useCallback(() => {
    return JSON.stringify(skills.map(({ id, ...rest }) => rest), null, 2)
  }, [skills])

  return { skills, loading, error, refresh, exportSkills }
}
