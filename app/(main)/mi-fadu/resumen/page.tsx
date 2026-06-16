import { Sparkles, Star, Plus } from "lucide-react"
import { SectionCard } from "@/app/components/ui/section-card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"

const recorrido = {
  percent: 44,
  loaded: 14,
  total: 32,
  years: [
    { label: "1° año", done: 6, total: 6 },
    { label: "2° año", done: 5, total: 6 },
    { label: "3° año", done: 3, total: 5 },
    { label: "4° año", done: 0, total: 5 },
  ],
  paraExplorar: [
    { name: "Diseño Gráfico IV", year: "4° año" },
    { name: "Tipografía III", year: "3° año" },
    { name: "Diseño Editorial", year: "4° año" },
  ],
}

const pendientes = [
  { subject: "Diseño Gráfico III", catedra: "Cátedra Gabriele", year: "3° año" },
  { subject: "Morfología II", catedra: "Cátedra Ex Mazzeo", year: "2° año" },
  { subject: "Tecnología III", catedra: "Sin cátedra", year: "3° año" },
]

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

export default function ResumenPage() {
  return (
    <div className="space-y-5">
      <SectionCard
        title="Tu recorrido"
        description="Según las materias que cargaste. No es un avance oficial."
      >
        <div>
          <ProgressBar percent={recorrido.percent} />
          <p className={`mt-2 ${eyebrowClass}`}>
            {recorrido.loaded} de {recorrido.total} materias cargadas
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recorrido.years.map((year) => (
            <div key={year.label} className="border-border bg-background/40 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <span className={eyebrowClass}>{year.label}</span>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {year.done}/{year.total}
                </span>
              </div>
              <ProgressBar
                percent={year.total > 0 ? (year.done / year.total) * 100 : 0}
                className="mt-3 h-1.5"
              />
            </div>
          ))}
        </div>

        <div className="border-border rounded-xl border p-4">
          <p className={`flex items-center gap-2 ${eyebrowClass}`}>
            <Sparkles className="text-primary size-3.5" />
            Para explorar después
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recorrido.paraExplorar.map((item) => (
              <Badge key={item.name} variant="outline" className="h-auto gap-2 px-3 py-1.5 text-sm">
                <span className="text-foreground">{item.name}</span>
                <span className="text-muted-foreground font-mono text-[0.65rem] tracking-widest uppercase">
                  {item.year}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Experiencias pendientes"
        description={`Tenés ${pendientes.length} cursadas sin experiencia. Tu opinión puede ayudar a otros estudiantes.`}
        icon={<Star className="text-primary size-5" />}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {pendientes.map((item) => (
            <div
              key={item.subject}
              className="border-border bg-background/40 flex items-center justify-between gap-4 rounded-xl border p-4"
            >
              <div className="min-w-0">
                <p className="text-foreground font-medium">{item.subject}</p>
                <p className={`mt-0.5 ${eyebrowClass}`}>
                  {item.catedra} · {item.year}
                </p>
              </div>
              <Button size="sm" className="rounded-full">
                <Plus />
                Dejar
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
