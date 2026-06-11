import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/app/components/site-header"
import { Toast } from "@base-ui/react/toast"
import { Toaster } from "../components/ui/toast"
import { accountService } from "@/lib/api/services/account.service.server"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // Guard de onboarding: solo afecta a usuarios logueados que todavía no eligieron
  // username. El browsing público (sin sesión) sigue intacto. `/onboarding` vive
  // fuera de `(main)`, así que no se loopea. Salteable vía cookie de sesión.
  const me = await accountService.getMe()

  if (me?.needsOnboarding) {
    const skipped = (await cookies()).get("fh_onboarding_skipped")
    if (!skipped) redirect("/onboarding")
  }

  return (
    <>
      <Toast.Provider>
        <SiteHeader me={me} />
        {children}
        <Toaster />
      </Toast.Provider>
    </>
  )
}
