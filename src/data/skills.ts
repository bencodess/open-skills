import rawSkills from './skills.json'

export interface Skill {
  id: string
  name: string
  desc: string
  tags: string[]
  status: 'curated' | 'experimental' | 'community'
  license: string
  path: string
}

export const SKILLS_DATA: Skill[] = (rawSkills as Array<Omit<Skill, 'id'>>).map((s, i) => ({
  ...s,
  id: s.name || String(i),
}))
