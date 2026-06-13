import Link from "next/link"

export function SubjectCard({
  name,
  slug,
  year,
  degreeName,
  departmentCount,
  reviewCount,
}: {
  name: string
  slug: string
  year?: number | null
  degreeName?: string
  departmentCount?: number
  reviewCount?: number
}) {
  return (
    <Link
      href={`/materias/${slug}`}
      className="border-border bg-card/80 hover:border-primary/40 group flex flex-col gap-3 rounded-2xl border p-5 backdrop-blur-sm transition-colors"
    >
      {(year || degreeName) && (
        <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.15em] uppercase">
          {year && <span className="text-primary">{year}° año</span>}
          {year && degreeName && <span className="text-muted-foreground/40">·</span>}
          {degreeName && <span>{degreeName}</span>}
        </div>
      )}

      <h3 className="text-foreground group-hover:text-accent text-base font-semibold tracking-tight transition-colors">
        {name}
      </h3>

      {(departmentCount !== undefined || reviewCount !== undefined) && (
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          {departmentCount !== undefined && <span>{departmentCount} cátedras</span>}
          {departmentCount !== undefined && reviewCount !== undefined && (
            <span className="text-muted-foreground/30">·</span>
          )}
          {reviewCount !== undefined && <span>{reviewCount} experiencias</span>}
        </div>
      )}
    </Link>
  )
}
