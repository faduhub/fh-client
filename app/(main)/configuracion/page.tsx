import AppHeader from "@/app/components/ui/app-header"
import { SettingsLayout } from "@/app/components/ui/settings-layout"

export const metadata = {
  title: "Ajustes · faduHub",
  description: "Configurá tu perfil, carrera, materias y apariencia.",
}

export default function SettingsPage() {
  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <AppHeader title="Configuración" />

        <div className="mt-8">
          <SettingsLayout />
        </div>
      </div>
    </main>
  )
}
