import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { accountService } from "@/lib/api/services/account.service.server"
import { AppSidebar } from "@/app/components/app-sidebar"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const me = await accountService.getMe()

  if (!me) redirect("/login")

  if (me.needsOnboarding) {
    const skipped = (await cookies()).get("fh_onboarding_skipped")
    if (!skipped) redirect("/onboarding")
  }

  return (
    <div className="flex min-h-svh">
      <AppSidebar me={me} />
      <main className="min-w-0 flex-1">{children}</main>
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none fixed top-0 -left-40 size-128 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-accent/10 pointer-events-none fixed -right-40 bottom-0 size-128 rounded-full blur-3xl"
      />
    </div>
  )
}
