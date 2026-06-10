import { MapPin } from 'lucide-react'

type Course = {
  code: string
  subject: string
  catedra: string
  sede: string
}

const courses: Course[] = [
  {
    code: 'DG',
    subject: 'Diseño Gráfico IV',
    catedra: 'Cát. Gabriele',
    sede: 'Pabellón 3',
  },
  {
    code: 'TIP',
    subject: 'Tipografía II',
    catedra: 'Cát. Cosgaya',
    sede: 'Pabellón 4',
  },
  {
    code: 'TEC',
    subject: 'Tecnología III',
    catedra: 'Cát. Ledesma',
    sede: 'Pabellón 3',
  },
]

export function CurrentCourses() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-foreground">
          Cursando ahora
        </h2>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
          2° Cuat. 2025
        </span>
      </div>

      <ul className="flex flex-col">
        {courses.map((course) => (
          <li
            key={course.code}
            className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/60"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary font-mono text-xs font-medium tracking-wide text-foreground">
              {course.code}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-foreground">
                {course.subject}
              </p>
              <p className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
                {course.catedra}
                <span className="text-border">·</span>
                <MapPin className="size-3" strokeWidth={1.5} />
                {course.sede}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
