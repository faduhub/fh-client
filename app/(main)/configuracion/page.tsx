import { redirect } from "next/navigation"
import { accountService } from "@/lib/api/services/account.service.server"
import { ProfileForm } from "./profile-form"
import { UsernameForm } from "./username-form"

export default async function ConfiguracionPage() {
  const me = await accountService.getMe()
  if (!me) redirect("/login")

  return (
    <main className="bg-background min-h-screen">
      <section className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1 text-sm">Tu identidad y datos de cuenta.</p>

        <div className="mt-10 flex flex-col gap-10">
          <UsernameForm me={me} />
          <ProfileForm me={me} />
        </div>
      </section>
    </main>
  )
}
