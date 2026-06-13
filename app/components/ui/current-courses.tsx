import { MapPin } from "lucide-react"

type Course = {
  code: string
  subject: string
  catedra: string
  sede: string
}

const courses: Course[] = [
  {
    code: "DG",
    subject: "Diseño Gráfico IV",
    catedra: "Cát. Gabriele",
    sede: "Pabellón 3",
  },
  {
    code: "TIP",
    subject: "Tipografía II",
    catedra: "Cát. Cosgaya",
    sede: "Pabellón 4",
  },
  {
    code: "TEC",
    subject: "Tecnología III",
    catedra: "Cát. Ledesma",
    sede: "Pabellón 3",
  },
]

export function CurrentCourses() {
  return (
    <div className="border-border bg-card/80 overflow-hidden rounded-2xl border backdrop-blur-sm">
      <div className="border-border flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-foreground font-mono text-xs tracking-[0.18em] uppercase">
          Cursando ahora
        </h2>
        <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          2° Cuat. 2025
        </span>
      </div>

      <ul className="flex flex-col">
        {courses.map((course) => (
          <li
            key={course.code}
            className="hover:bg-secondary/60 flex items-center gap-4 px-5 py-3.5 transition-colors"
          >
            <span className="border-border bg-secondary text-foreground flex size-11 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-medium tracking-wide">
              {course.code}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-foreground truncate text-sm font-medium">{course.subject}</p>
              <p className="text-muted-foreground flex items-center gap-1.5 font-mono text-[0.7rem] tracking-widest uppercase">
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
