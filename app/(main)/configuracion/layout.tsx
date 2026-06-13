import AppHeader from "@/app/components/ui/app-header"
import { SettingsLayout } from "@/app/components/ui/settings-layout"
import { accountService } from "@/lib/api/services/account.service.server"

export const metadata = {
  title: "Ajustes · faduHub",
  description: "Configurá tu perfil, carrera, materias y apariencia.",
}

export default async function ConfiguracionLayout({ children }: { children: React.ReactNode }) {
  const me = await accountService.getMe()

  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <AppHeader title="Configuración" />
        <div className="mt-8">
          <SettingsLayout me={me}>{children}</SettingsLayout>
        </div>
      </div>
    </main>
  )
}
