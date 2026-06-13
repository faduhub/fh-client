import { GradientAvatar } from "./gradient-avatar"
import { SettingsNav } from "./settings-nav"
import type { Me } from "@/lib/api/dtos/responses/me"

export function SettingsLayout({ me, children }: { me: Me | null; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <aside className="flex flex-col gap-6 lg:sticky lg:top-8 lg:w-64 lg:shrink-0">
        <div className="border-border bg-card/80 flex items-center gap-3 rounded-2xl border p-4 backdrop-blur-sm">
          <GradientAvatar seed="Martina Ferreyra" className="border-border size-11 border" />
          <div className="min-w-0 leading-tight">
            <p className="text-foreground truncate text-sm font-medium">{me?.username}</p>
            <p className="text-muted-foreground truncate font-mono text-[0.7rem] tracking-widest uppercase">
              {me?.firstName} {me?.lastName}
            </p>
          </div>
        </div>
        <SettingsNav />
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
