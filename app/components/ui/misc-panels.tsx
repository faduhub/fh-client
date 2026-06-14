"use client"

import { useState } from "react"
import { SectionCard, Field, TextInput } from "./settings-fields"

function Toggle({ defaultOn = false, label }: { defaultOn?: boolean; label: string }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-primary" : "bg-secondary"
      }`}
    >
      <span
        className={`bg-foreground absolute top-0.5 size-5 rounded-full transition-transform ${
          on ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      />
    </button>
  )
}

function ToggleRow({
  title,
  description,
  defaultOn,
}: {
  title: string
  description: string
  defaultOn?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="leading-tight">
        <p className="text-foreground text-sm">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{description}</p>
      </div>
      <Toggle defaultOn={defaultOn} label={title} />
    </div>
  )
}

const saveBtn =
  "inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_30px_-8px] shadow-primary/60 transition-all hover:shadow-primary/80"

export function SecurityPanel() {
  return (
    <SectionCard title="Seguridad" description="Mantené tu cuenta protegida.">
      <Field label="Contraseña actual">
        <TextInput type="password" placeholder="••••••••" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nueva contraseña" hint="Mínimo 8 caracteres.">
          <TextInput type="password" placeholder="••••••••" />
        </Field>
        <Field label="Repetir contraseña">
          <TextInput type="password" placeholder="••••••••" />
        </Field>
      </div>
      <div className="border-border border-t pt-6">
        <ToggleRow
          title="Autenticación en dos pasos (2FA)"
          description="Pedí un código adicional al iniciar sesión."
        />
      </div>
      <div className="border-border flex justify-end border-t pt-6">
        <button type="button" className={saveBtn}>
          Actualizar contraseña
        </button>
      </div>
    </SectionCard>
  )
}
