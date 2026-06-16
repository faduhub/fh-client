import { Sparkles } from "lucide-react"
import { SectionCard } from "@/app/components/ui/section-card"
import { Badge } from "@/app/components/ui/badge"
import { recorridoService } from "@/lib/api/services/recorrido.service.server"

const eyebrowClass = "text-muted-foreground font-mono text-[0.7rem] tracking-widest uppercase"

function ProgressBar({ percent, className = "h-2" }: { percent: number; className?: string }) {
  return (
    <div className={`bg-secondary w-full overflow-hidden rounded-full ${className}`}>
      <div
        className="from-primary h-full rounded-full bg-linear-to-r to-purple-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export default async function ResumenPage() {
  const recorrido = await recorridoService.get()

  return (
    <div className="space-y-5">
      <SectionCard
        title="Tu recorrido"
        description="Según las materias que cargaste. No es un avance oficial."
      >
        <div>
          <ProgressBar percent={recorrido.totals.percent} />
          <p className={`mt-2 ${eyebrowClass}`}>
            {recorrido.totals.loaded} de {recorrido.totals.plan} materias cargadas
            {recorrido.currentYear.label ? ` · ${recorrido.currentYear.label}` : ""}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recorrido.years.map((year) => (
            <div key={year.year} className="border-border bg-background/40 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <span className={eyebrowClass}>{year.year}° año</span>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {year.loaded}/{year.total}
                </span>
              </div>
              <ProgressBar percent={year.percent} className="mt-3 h-1.5" />
            </div>
          ))}
        </div>

        {recorrido.suggestedNext.length > 0 && (
          <div className="border-border rounded-xl border p-4">
            <p className={`flex items-center gap-2 ${eyebrowClass}`}>
              <Sparkles className="text-primary size-3.5" />
              Para explorar después
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {recorrido.suggestedNext.map((item) => (
                <Badge key={item.id} variant="outline" className="h-auto gap-2 px-3 py-1.5 text-sm">
                  <span className="text-foreground">{item.name}</span>
                  <span className="text-muted-foreground font-mono text-[0.65rem] tracking-widest uppercase">
                    {item.year}° · {item.experiencesCount}{" "}
                    {item.experiencesCount === 1 ? "experiencia" : "experiencias"}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
