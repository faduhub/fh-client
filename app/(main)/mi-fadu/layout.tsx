import AppHeader from "@/app/components/ui/app-header"
import { MiFaduTabs } from "@/app/components/ui/mi-fadu-tabs"

export const metadata = {
  title: "Mi FADU · faduHub",
  description: "Tu espacio personal en faduHub.",
}

export default function MiFaduLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <AppHeader title="Mi FADU" />
        <div className="mt-8">
          <MiFaduTabs />
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  )
}
