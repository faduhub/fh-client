import { SettingsLayout } from "@/app/components/ui/settings-layout"

export const metadata = {
  title: "Ajustes · faduHub",
  description: "Configurá tu perfil, carrera, materias y apariencia.",
}

export default function SettingsPage() {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div>
          <span className="text-primary font-mono text-[0.7rem] tracking-[0.2em] uppercase">
            USR_01 / Ajustes
          </span>
          <h1 className="text-foreground mt-1 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Configuración
          </h1>
          <div className="from-primary/60 via-border mt-5 h-px w-full bg-linear-to-r to-transparent" />
        </div>

        <div className="mt-8">
          <SettingsLayout />
        </div>
      </div>
    </main>
  )
}
