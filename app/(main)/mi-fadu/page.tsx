import AppHeader from "@/app/components/ui/app-header"
import { CarreraPanel } from "@/app/components/ui/courses-panels"
import { MateriasPanel } from "@/app/components/ui/materias-panel"
import { accountService } from "@/lib/api/services/account.service.server"

export const metadata = {
  title: "Mi FADU · faduHub",
  description: "Gestioná tu carrera y materias.",
}

export default async function MiFaduPage() {
  const me = await accountService.getMe()

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <AppHeader title="Mi FADU" />

        <section className="mt-8 space-y-5">
          {me ? (
            <>
              <CarreraPanel me={me} />
              {me.degrees.length > 0 && <MateriasPanel />}
            </>
          ) : null}
        </section>
      </div>
    </main>
  )
}
