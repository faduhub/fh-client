"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { SectionCard, Field, FieldLabel, TextInput, SelectInput } from "./settings-fields"

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
          on ? "translate-x-[1.375rem]" : "translate-x-0.5"
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

export function AccountPanel() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Cuenta" description="Datos privados de tu cuenta.">
        <Field label="Email de la cuenta" hint="Usado para iniciar sesión y notificaciones.">
          <TextInput type="email" defaultValue="martina@fadu.uba.ar" />
        </Field>
        <Field label="Idioma">
          <SelectInput defaultValue="es">
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </SelectInput>
        </Field>
        <ToggleRow
          title="Mostrar email en el perfil"
          description="Si lo desactivás, tu email no será visible públicamente."
          defaultOn={false}
        />
        <div className="border-border flex justify-end border-t pt-6">
          <button type="button" className={saveBtn}>
            Guardar cambios
          </button>
        </div>
      </SectionCard>

      <section className="border-destructive/40 bg-destructive/5 overflow-hidden rounded-2xl border">
        <div className="border-destructive/30 flex items-center gap-2 border-b px-6 py-5">
          <AlertTriangle className="text-destructive size-4" strokeWidth={1.5} />
          <h2 className="text-foreground font-serif text-xl font-medium tracking-tight">
            Zona de riesgo
          </h2>
        </div>
        <div className="flex items-center justify-between gap-4 p-6">
          <div className="leading-tight">
            <p className="text-foreground text-sm">Eliminar cuenta</p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              Esto borra tu perfil y todas tus experiencias. No se puede deshacer.
            </p>
          </div>
          <button
            type="button"
            className="border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20 inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
            Eliminar
          </button>
        </div>
      </section>
    </div>
  )
}

export function NotificationsPanel() {
  return (
    <SectionCard title="Notificaciones" description="Elegí cómo y cuándo querés que te avisemos.">
      <div className="flex flex-col gap-5">
        <FieldLabel>Por email</FieldLabel>
        <ToggleRow
          title="Respuestas a tus experiencias"
          description="Cuando alguien comenta o responde una experiencia tuya."
          defaultOn
        />
        <ToggleRow
          title="Me gusta y reacciones"
          description="Resumen semanal de la actividad en tus aportes."
          defaultOn
        />
        <ToggleRow
          title="Novedades de cátedras que seguís"
          description="Nuevas experiencias en materias y cátedras guardadas."
        />
      </div>
      <div className="border-border flex flex-col gap-5 border-t pt-6">
        <FieldLabel>En la app</FieldLabel>
        <ToggleRow
          title="Logros y badges"
          description="Avisos cuando desbloqueás un nuevo logro."
          defaultOn
        />
        <ToggleRow
          title="Recordatorios"
          description="Sugerencias para compartir tus experiencias sobre materias que ya cursaste."
          defaultOn
        />
      </div>
      <div className="border-border flex justify-end border-t pt-6">
        <button type="button" className={saveBtn}>
          Guardar preferencias
        </button>
      </div>
    </SectionCard>
  )
}

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
