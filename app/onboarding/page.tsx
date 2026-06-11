import { redirect } from "next/navigation"
import { accountService } from "@/lib/api/services/account.service.server"
import { OnboardingForm } from "./onboarding-form"

export default async function OnboardingPage() {
  const me = await accountService.getMe()
  if (!me) redirect("/login")
  if (!me.needsOnboarding) redirect("/")

  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Elegí tu username
          </h1>
          <p className="text-muted-foreground mt-2 text-sm text-pretty">
            Es tu identidad pública en faduHub: lo que ven los demás cuando comentás o dejás una
            reseña. Tu nombre real queda privado.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </main>
  )
}
