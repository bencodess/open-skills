import { cn } from "@/lib/utils"

interface StatsBarProps {
  total: number
  curated: number
  experimental: number
  community: number
  loading: boolean
}

export function StatsBar({ total, curated, experimental, community, loading }: StatsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-8 py-3 px-4 border-b border-border">
      <StatItem dot="bg-orange-500" label="total" value={total} mono loading={loading} />
      <StatItem dot="bg-orange-600" label="curated" value={curated} />
      <StatItem dot="bg-indigo-500" label="experimental" value={experimental} />
      <StatItem dot="bg-gray-500" label="community" value={community} />
    </div>
  )
}

function StatItem({ dot, label, value, mono, loading }: { dot: string; label: string; value: number; mono?: boolean; loading?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      <span className="text-xs font-mono text-muted-foreground">
        {mono ? (
          <span className={cn("font-bold text-base", loading ? "text-muted-foreground animate-pulse" : "text-primary")}>
            {loading ? '?' : value}
          </span>
        ) : value}{' '}
        {label}
      </span>
    </div>
  )
}
