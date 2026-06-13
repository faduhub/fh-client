"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import type { DepartmentStats } from "@/lib/api/dtos/responses/department"
import type { SubjectItem } from "@/lib/api/dtos/responses/subject"
import type { TagItem } from "@/lib/api/dtos/responses/tag"
import type { DegreeItem } from "@/lib/api/dtos/responses/degree"
import { createReviewAction } from "@/lib/api/actions/review.actions"
import { useSession } from "@/lib/auth-client"
import { Toast } from "@/app/components/ui/toast"
import { Button } from "@/app/components/ui/button"
import { SectionCard } from "@/app/components/ui/section-card"
import { Field } from "@/app/components/ui/field"
import { FieldGroup } from "@/app/components/ui/field-group"
import { FieldGrid } from "@/app/components/ui/field-grid"
import { SelectInput } from "@/app/components/ui/select-input"
import { TextArea } from "@/app/components/ui/text-area"
import { TextInput } from "@/app/components/ui/text-input"
import { ToggleOptions } from "@/app/components/ui/toggle-options"
import { ChipPicker } from "@/app/components/ui/chip-picker"

export function ReviewForm({
  departments,
  subjects,
  tags,
  degrees,
}: {
  departments: DepartmentStats[]
  subjects: SubjectItem[]
  tags: TagItem[]
  degrees: DegreeItem[]
}) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) router.replace("/login")
  }, [session, isPending, router])

  const [catedraSlug, setCatedraSlug] = useState("")
  const [departmentId, setDepartmentId] = useState<string | null>(null)
  const [subjectId, setSubjectId] = useState<string | null>(null)
  const [degreeId, setDegreeId] = useState<string | null>(null)
  const [recommends, setRecommends] = useState<boolean | null>(null)
  const [body, setBody] = useState("")
  const [year, setYear] = useState(new Date().getFullYear())
  const [period, setPeriod] = useState<"FIRST" | "SECOND" | "SUMMER">("FIRST")
  const [tagIds, setTagIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const toastManager = Toast.useToastManager()

  const currentYear = new Date().getFullYear()

  function toggleTag(id: number) {
    setTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!catedraSlug) return setError("Seleccioná una cátedra")
    if (!departmentId)
      return setError("No se pudo resolver el ID de la cátedra — reiniciá el servidor")
    if (!subjectId) return setError("Seleccioná una materia")
    if (!degreeId) return setError("Seleccioná una carrera")
    if (recommends === null) return setError("Indicá si recomendás la cátedra")
    if (!body.trim()) return setError("Escribí una experiencia")

    setLoading(true)
    const result = await createReviewAction({
      departmentId,
      subjectId,
      degreeId,
      recommends,
      body: body.trim(),
      year,
      period,
      tagIds,
    })
    setLoading(false)

    if (!result.success) {
      toastManager.add({
        title: "Error",
        description: result.error ?? "Error al crear la experiencia",
        type: "error",
      })
      setError(result.error ?? "Error al crear la experiencia")
      return
    }

    toastManager.add({
      title: "Experiencia publicada",
      description: "¡Gracias por tu aporte!",
      type: "success",
    })
    router.push("/experiencias")
    router.refresh()
  }

  return (
    <SectionCard
      title="Contá tu cursada"
      description="Tu experiencia se suma al perfil de la cátedra y ayuda a quienes vienen atrás a elegir mejor."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FieldGrid>
          <Field label="Cátedra" required>
            <SelectInput
              value={catedraSlug}
              onChange={(e) => {
                const slug = e.target.value
                setCatedraSlug(slug)
                const found = departments.find((c) => c.slug === slug)
                setDepartmentId(found?.id ?? null)
              }}
            >
              <option value="">Seleccioná una cátedra</option>
              {departments.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Materia" required>
            <SelectInput
              value={subjectId ?? ""}
              onChange={(e) => setSubjectId(e.target.value || null)}
            >
              <option value="">Seleccioná una materia</option>
              {subjects.map((m) => (
                <option key={m.slug} value={m.id}>
                  {m.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Carrera" required>
            <SelectInput
              value={degreeId ?? ""}
              onChange={(e) => setDegreeId(e.target.value || null)}
            >
              <option value="">Seleccioná una carrera</option>
              {degrees.map((c) => (
                <option key={c.slug} value={c.id}>
                  {c.name}
                </option>
              ))}
            </SelectInput>
          </Field>
        </FieldGrid>

        <FieldGroup label="¿Recomendás la cátedra?" required>
          <ToggleOptions
            options={[
              { value: true, label: "Sí", icon: <Check className="size-4" /> },
              { value: false, label: "No", icon: <X className="size-4" /> },
            ]}
            value={recommends}
            onChange={setRecommends}
          />
        </FieldGroup>

        <Field label="Experiencia" required>
          <TextArea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Contá tu experiencia con la cátedra..."
            rows={5}
            className="resize-none"
          />
        </Field>

        <FieldGrid>
          <Field label="Año cursado">
            <TextInput
              type="number"
              min={2000}
              max={currentYear}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </Field>

          <Field label="Período">
            <SelectInput
              value={period}
              onChange={(e) => setPeriod(e.target.value as typeof period)}
            >
              <option value="FIRST">Primer cuatrimestre</option>
              <option value="SECOND">Segundo cuatrimestre</option>
              <option value="SUMMER">Verano</option>
            </SelectInput>
          </Field>
        </FieldGrid>

        {tags.length > 0 && (
          <FieldGroup label="Tags">
            <ChipPicker options={tags} selected={tagIds} onChange={toggleTag} />
          </FieldGroup>
        )}

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="border-border flex items-center justify-end gap-4 border-t pt-6">
          <Button onClick={() => router.back()} type="button" variant="ghost">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="px-8">
            {loading ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </form>
    </SectionCard>
  )
}
