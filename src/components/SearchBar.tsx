import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface SearchBarProps {
  query: string
  onQueryChange: (query: string) => void
  allTags: string[]
  activeTag: string
  onTagChange: (tag: string) => void
}

export function SearchBar({ query, onQueryChange, allTags, activeTag, onTagChange }: SearchBarProps) {
  return (
    <section className="mb-10 concrete-bg p-6 md:p-10 border border-border">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs text-primary">~/$</span>
          <span className="font-mono text-xs text-muted-foreground">skills search</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-foreground">
          discover agent skills
        </h2>
        <p className="text-sm mb-6 text-muted-foreground max-w-[540px]">
          Searchable catalog of reusable agent instructions, workflows, and capabilities
          for OpenCode and compatible agent runtimes.
        </p>

        <div className="flex items-center gap-3 border border-input bg-muted/50 px-4 py-3 mb-4 focus-within:border-primary transition-colors duration-200">
          <svg className="w-5 h-5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <Input
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="Filter skills by name, description, or tags..."
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            aria-label="Search skills"
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-muted text-muted-foreground border border-border">
            /
          </kbd>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <Badge
            variant={activeTag === 'all' ? 'primary' : 'default'}
            className="cursor-pointer select-none"
            onClick={() => onTagChange('all')}
          >
            all
          </Badge>
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={activeTag === tag ? 'primary' : 'default'}
              className="cursor-pointer select-none"
              onClick={() => onTagChange(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
