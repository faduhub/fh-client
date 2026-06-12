import { ProfileHeader } from "@/app/components/ui/profile-headbar"
import { SettingsLayout } from "@/app/components/ui/settings-layout"

export const metadata = {
  title: "Ajustes · faduHub",
  description: "Configurá tu perfil, carrera, materias y apariencia.",
}

export default function SettingsPage() {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      {/* Glows de fondo */}
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none fixed top-0 -left-40 size-[32rem] rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-accent/10 pointer-events-none fixed -right-40 bottom-0 size-[32rem] rounded-full blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <ProfileHeader />

        <div className="mt-8">
          <span className="text-primary font-mono text-[0.7rem] tracking-[0.2em] uppercase">
            USR_01 / Ajustes
          </span>
          <h1 className="text-foreground mt-1 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Configuración
          </h1>
          <div className="from-primary/60 via-border mt-5 h-px w-full bg-gradient-to-r to-transparent" />
        </div>

        <div className="mt-8">
          <SettingsLayout />
        </div>
      </div>
    </main>
  )
}
