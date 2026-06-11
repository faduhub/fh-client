"use client"

import { useState } from "react"
import { Plus, X, GraduationCap } from "lucide-react"
import { SectionCard, Field, FieldLabel, SelectInput } from "./settings-fields"

const CARRERAS = [
  "Diseño Gráfico",
  "Diseño Industrial",
  "Diseño de Indumentaria",
  "Diseño de Imagen y Sonido",
  "Arquitectura",
  "Diseño del Paisaje",
]

const ANIOS = ["1° año", "2° año", "3° año", "4° año", "5° año", "Graduada/o"]

type TakenCourse = {
  id: number
  subject: string
  catedra: string
}

const initialCourses: TakenCourse[] = [
  { id: 1, subject: "Diseño Gráfico III", catedra: "Cát. Gabriele" },
  { id: 2, subject: "Tipografía I", catedra: "Cát. Cosgaya" },
  { id: 3, subject: "Morfología II", catedra: "Cát. Wolkowicz" },
  { id: 4, subject: "Comunicación II", catedra: "Cát. Mazzeo" },
]

export function CoursesPanel() {
  const [courses, setCourses] = useState(initialCourses)
  const [subject, setSubject] = useState("")
  const [catedra, setCatedra] = useState("")

  function addCourse() {
    if (!subject.trim()) return
    setCourses((c) => [
      ...c,
      { id: Date.now(), subject: subject.trim(), catedra: catedra.trim() || "Sin cátedra" },
    ])
    setSubject("")
    setCatedra("")
  }

  function removeCourse(id: number) {
    setCourses((c) => c.filter((x) => x.id !== id))
  }

  return (
    <SectionCard
      title="Carrera y materias"
      description="Definí tu carrera y registrá las materias que ya cursaste."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Carrera">
          <SelectInput defaultValue="Diseño Gráfico">
            {CARRERAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Año actual">
          <SelectInput defaultValue="3° año">
            {ANIOS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="border-border flex flex-col gap-3 border-t pt-6">
        <div className="flex items-center justify-between">
          <FieldLabel>Materias cursadas</FieldLabel>
          <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            {courses.length} materias
          </span>
        </div>

        <ul className="flex flex-col gap-2">
          {courses.map((course) => (
            <li
              key={course.id}
              className="border-border bg-secondary/40 flex items-center gap-3 rounded-xl border px-4 py-3"
            >
              <GraduationCap className="text-primary size-4 shrink-0" strokeWidth={1.5} />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-foreground truncate text-sm">{course.subject}</p>
                <p className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.1em] uppercase">
                  {course.catedra}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeCourse(course.id)}
                aria-label={`Quitar ${course.subject}`}
                className="text-muted-foreground hover:bg-destructive/15 hover:text-destructive flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>

        {/* Agregar materia */}
        <div className="border-border grid gap-2.5 rounded-xl border border-dashed p-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Materia (ej. Diseño Gráfico IV)"
            className="border-border bg-secondary/40 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none"
          />
          <input
            value={catedra}
            onChange={(e) => setCatedra(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCourse()}
            placeholder="Cátedra (ej. Cát. Gabriele)"
            className="border-border bg-secondary/40 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none"
          />
          <button
            type="button"
            onClick={addCourse}
            className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Plus className="size-4" strokeWidth={2} />∂ Agregar
          </button>
        </div>
      </div>

      <div className="border-border flex justify-end border-t pt-6">
        <button
          type="button"
          className="bg-primary text-primary-foreground shadow-primary/60 hover:shadow-primary/80 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium shadow-[0_0_30px_-8px] transition-all"
        >
          Guardar cambios
        </button>
      </div>
    </SectionCard>
  )
}
