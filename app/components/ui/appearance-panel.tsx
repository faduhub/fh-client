"use client"

import { useState } from "react"
import { Check, Moon, Sun, Monitor } from "lucide-react"
import { SectionCard, FieldLabel } from "./settings-fields"

const THEMES = [
  {
    id: "dark",
    label: "Oscuro",
    icon: Moon,
    bg: "oklch(0.16 0.025 290)",
    fg: "oklch(0.95 0.01 300)",
  },
  { id: "light", label: "Claro", icon: Sun, bg: "oklch(0.97 0.01 300)", fg: "oklch(0.2 0.03 290)" },
  {
    id: "system",
    label: "Sistema",
    icon: Monitor,
    bg: "oklch(0.16 0.025 290)",
    fg: "oklch(0.95 0.01 300)",
  },
]

const ACCENTS = [
  { id: "magenta", value: "oklch(0.68 0.24 350)" },
  { id: "violet", value: "oklch(0.62 0.2 300)" },
  { id: "orange", value: "oklch(0.72 0.18 50)" },
  { id: "lime", value: "oklch(0.85 0.22 130)" },
  { id: "cyan", value: "oklch(0.72 0.14 200)" },
]

export function AppearancePanel() {
  const [theme, setTheme] = useState("dark")
  const [accent, setAccent] = useState("magenta")

  return (
    <SectionCard
      title="Apariencia"
      description="Personalizá cómo se ve la app. Estos ajustes solo afectan a tu cuenta."
    >
      <div className="flex flex-col gap-3">
        <FieldLabel>Tema</FieldLabel>
        <div className="grid gap-4 sm:grid-cols-3">
          {THEMES.map((t) => {
            const isActive = theme === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`group flex flex-col gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  isActive ? "border-primary" : "border-border hover:border-primary/40"
                }`}
              >
                <span
                  className="border-border relative flex h-20 items-end overflow-hidden rounded-lg border p-2.5"
                  style={{ background: t.bg }}
                >
                  <span
                    className="h-2.5 w-2/3 rounded-full"
                    style={{ background: t.fg, opacity: 0.5 }}
                  />
                  {t.id === "system" && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 right-0 w-1/2"
                      style={{ background: "oklch(0.97 0.01 300)", opacity: 0.12 }}
                    />
                  )}
                </span>
                <span className="flex items-center justify-between">
                  <span className="text-foreground inline-flex items-center gap-2 text-sm">
                    <t.icon className="size-4" strokeWidth={1.5} />
                    {t.label}
                  </span>
                  {isActive && (
                    <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-border flex flex-col gap-3 border-t pt-6">
        <FieldLabel>Color de acento</FieldLabel>
        <div className="flex flex-wrap items-center gap-3">
          {ACCENTS.map((a) => {
            const isActive = accent === a.id
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setAccent(a.id)}
                aria-label={`Acento ${a.id}`}
                className={`flex size-10 items-center justify-center rounded-full transition-transform hover:scale-105 ${
                  isActive ? "ring-offset-card ring-2 ring-offset-2" : ""
                }`}
                style={{
                  background: a.value,
                  ...(isActive ? { boxShadow: `0 0 0 2px ${a.value}` } : {}),
                }}
              >
                {isActive && <Check className="text-primary-foreground size-4" strokeWidth={2.5} />}
              </button>
            )
          })}
        </div>
        <p className="text-muted-foreground/70 text-xs leading-relaxed">
          El acento se aplica a botones, enlaces y estados activos en toda la app.
        </p>
      </div>

      <div className="border-border flex justify-end border-t pt-6">
        <button
          type="button"
          className="bg-primary text-primary-foreground shadow-primary/60 hover:shadow-primary/80 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium shadow-[0_0_30px_-8px] transition-all"
        >
          Guardar preferencias
        </button>
      </div>
    </SectionCard>
  )
}
